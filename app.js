const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Middleware de autenticação global
global.authenticationMiddleware = () => {
  return (req, res, next) => {
    if (req.isAuthenticated() && require("./permissions")(req)) {
      return next();
    }
    res.redirect("/login?accessDenied=true");
  };
};

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const reportsRouter = require("./routes/reports");

const app = express();

// Configuração do mecanismo de visualização
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares de logging e análise de corpo da requisição
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuração de autenticação
require("./auth")(passport);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_CONNECTION,
      dbName: process.env.MONGO_DB,
      ttl: 30 * 60,
      autoRemove: "native",
    }),
    secret: process.env.MONGO_STORE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use("/index", indexRouter);
app.use("/users", usersRouter);
app.use("/reports", reportsRouter);
app.use("/", loginRouter);

// Middleware para lidar com erro 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Middleware para lidar com outros erros
app.use(function (err, req, res, next) {
  // Configuração dos locais para o template de erro
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Renderização da página de erro
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
