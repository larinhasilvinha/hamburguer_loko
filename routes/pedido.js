const express = require("express");
const router = express.Router();

// Rotas para pedidos
router.get("/", (req, res) => {
    res.send("Lista de pedidos");
});

module.exports = router;
