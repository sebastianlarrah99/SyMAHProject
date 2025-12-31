const express = require("express");
const router = express.Router();
const registroHorasController = require("../controllers/registroHorasController");

// Ruta para registrar horas trabajadas
router.post("/", registroHorasController.registrarHoras);

// Ruta para obtener horarios registrados por empleado
router.get("/empleado/:empleadoId", registroHorasController.obtenerPorEmpleado);

// Ruta para obtener horarios registrados por trabajo
router.get("/trabajo/:trabajoId", registroHorasController.obtenerPorTrabajo);
// Ruta para eliminar un registro de horas
router.delete("/:id", registroHorasController.eliminarRegistroHoras);

module.exports = router;
