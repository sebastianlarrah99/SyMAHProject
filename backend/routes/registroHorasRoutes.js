const express = require("express");
const router = express.Router();
const registroHorasController = require("../controllers/registroHorasController");

// Ruta para registrar horas trabajadas
router.post("/", registroHorasController.registrarHoras);

module.exports = router;
