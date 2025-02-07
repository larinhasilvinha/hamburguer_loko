const express = require("express");
const router = express.Router();

// Rotas para produtos
router.get("/", (req, res) => {
    res.send("Lista de produtos");
});

module.exports = router;
