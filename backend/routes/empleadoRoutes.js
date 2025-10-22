const express = require("express");
const router = express.Router();
const empleadoController = require("../controllers/empleadoController");

// CRUD Operations para Empleados

// GET - Obtener todos los empleados (Read - Consulta)
router.get("/", empleadoController.obtenerTodos);

// GET - Obtener empleado por ID (Read - Consulta específica)
router.get("/:id", empleadoController.obtenerPorId);

// POST - Crear nuevo empleado (Create - Alta)
router.post("/", empleadoController.crear);

// PUT - Actualizar empleado existente (Update - Modificación)
router.put("/:id", empleadoController.actualizar);

// DELETE - Eliminar empleado (Delete - Baja)
router.delete("/:id", empleadoController.eliminar);

// GET - Buscar empleados por criterios específicos
router.get("/buscar/por-nombre/:nombre", empleadoController.buscarPorNombre);
router.get("/buscar/por-cargo/:cargo", empleadoController.buscarPorCargo);

// GET - Obtener trabajos asignados a un empleado
router.get("/:id/trabajos", empleadoController.obtenerTrabajos);

// GET - Obtener pagos recibidos por un empleado
router.get("/:id/pagos", empleadoController.obtenerPagos);

// GET - Obtener estadísticas de un empleado
router.get("/:id/estadisticas", empleadoController.obtenerEstadisticas);

// PUT - Actualizar estado de empleado (activo/inactivo)
router.put("/:id/estado", empleadoController.actualizarEstado);

// GET - Obtener empleados activos
router.get("/estado/activos", empleadoController.obtenerActivos);

// GET - Obtener empleados inactivos
router.get("/estado/inactivos", empleadoController.obtenerInactivos);

module.exports = router;
