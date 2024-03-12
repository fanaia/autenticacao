const bcrypt = require("bcryptjs");

function createUser(username, password, email, profile, callback) {
  const cryptoPassword = bcrypt.hashSync(password, 10);
  global.db
    .collection("users")
    .insertOne(
      { username, password: cryptoPassword, email, profile },
      callback
    );
}

function resetPassword(email, callback) {
  const utils = require("./utils");
  const newPassword = utils.generatePassword();
  const cryptoPassword = bcrypt.hashSync(newPassword, 10);
  global.db
    .collection("users")
    .updateOne(
      { email: email },
      { $set: { password: cryptoPassword } },
      (err, res) => {
        callback(err, res, newPassword);
      }
    );
}

const countAll = async () => {
  return await global.db.collection("users").countDocuments();
};

const TAMANHO_PAGINA = 5;
const findAllUsers = async (pagina) => {
  const totalSkip = (pagina - 1) * TAMANHO_PAGINA;
  return await global.db
    .collection("users")
    .find()
    .skip(totalSkip)
    .limit(TAMANHO_PAGINA)
    .toArray();
};

module.exports = {
  createUser,
  resetPassword,
  findAllUsers,
  TAMANHO_PAGINA,
  countAll,
};
