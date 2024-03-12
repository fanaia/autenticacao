const express = require("express");
const router = express.Router();
const db = require("../db");

router.get(
  "/:pagina?",
  global.authenticationMiddleware(),
  async (req, res, next) => {
    try {
      const pagina = parseInt(req.params.pagina || "1");
      const qtd = await db.countAll();
      const qtdPaginas = Math.ceil(qtd / db.TAMANHO_PAGINA);
      const docs = await db.findAllUsers(pagina);

      res.render("index", {
        title: req.user.username,
        docs,
        qtd,
        qtdPaginas,
        pagina,
        profile: req.user.profile,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
