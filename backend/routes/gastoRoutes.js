const express = require("express");
const {
  crearGasto,
  obtenerGastos,
  eliminarGasto,
} = require("../controllers/gastoController");

const router = express.Router();

// Ruta para crear un gasto
router.post("/", crearGasto);

// Ruta para obtener todos los gastos
router.get("/", obtenerGastos);

// Ruta para eliminar un gasto por ID
router.delete("/:id", eliminarGasto);

module.exports = router;
