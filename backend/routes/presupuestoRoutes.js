const express = require("express");
const router = express.Router();
const {
  crearPresupuesto,
  obtenerPresupuestos,
  eliminarPresupuesto,
  obtenerPresupuestoPorId,
} = require("../controllers/presupuestoController");

// Ruta para crear un presupuesto
router.post("/", crearPresupuesto);

// Ruta para obtener todos los presupuestos
router.get("/", obtenerPresupuestos);

// Ruta para obtener un presupuesto por ID
router.get("/:id", obtenerPresupuestoPorId);

// Ruta para eliminar un presupuesto por ID
router.delete("/:id", eliminarPresupuesto);

module.exports = router;
