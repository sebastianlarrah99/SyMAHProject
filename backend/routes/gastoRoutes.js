const express = require("express");
const {
  crearGasto,
  obtenerGastos,
  eliminarGasto,
  calcularGastosPorMes,
} = require("../controllers/gastoController");

const router = express.Router();

// Ruta para crear un gasto
router.post("/", crearGasto);

// Ruta para obtener todos los gastos
router.get("/", obtenerGastos);

// Ruta para eliminar un gasto por ID
router.delete("/:id", eliminarGasto);

// Ruta para calcular gastos por mes
router.get("/calcular/gastos-por-mes", calcularGastosPorMes);

module.exports = router;
