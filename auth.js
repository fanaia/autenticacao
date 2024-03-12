const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  // Função para encontrar um usuário pelo nome de usuário
  const findUser = async (username) => {
    try {
      return await global.db
        .collection("users")
        .findOne({ username: username });
    } catch (err) {
      throw err;
    }
  };

  // Função para encontrar um usuário pelo ID
  const findUserById = async (id) => {
    const ObjectId = require("mongodb").ObjectId;
    try {
      return await global.db
        .collection("users")
        .findOne({ _id: ObjectId.createFromHexString(id) });
    } catch (err) {
      throw err;
    }
  };

  // Serialização do usuário
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Desserialização do usuário
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Estratégia de autenticação local
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await findUser(username);
          if (!user) {
            return done(null, false); // Usuário não encontrado
          }
          // Comparando as senhas
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false); // Senha inválida
          }
          return done(null, user); // Autenticação bem-sucedida
        } catch (err) {
          return done(err); // Erro durante a autenticação
        }
      }
    )
  );
};
