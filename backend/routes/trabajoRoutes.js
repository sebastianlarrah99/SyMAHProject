const express = require("express");
const router = express.Router();
const trabajoController = require("../controllers/trabajoController");

// CRUD Operations para Trabajos

// GET - Obtener todos los trabajos (Read - Consulta)
router.get("/", trabajoController.obtenerTodos);

// GET - Obtener trabajo por ID (Read - Consulta específica)
router.get("/:id", trabajoController.obtenerPorId);

// POST - Crear nuevo trabajo (Create - Alta)
router.post("/", trabajoController.crear);

// PUT - Actualizar trabajo existente (Update - Modificación)
router.put("/:id", trabajoController.actualizar);

// DELETE - Eliminar trabajo (Delete - Baja)
router.delete("/:id", trabajoController.eliminar);

// GET - Buscar trabajos por criterios específicos
router.get(
  "/buscar/por-cliente/:clienteId",
  trabajoController.buscarPorCliente
);
router.get(
  "/buscar/por-empleado/:empleadoId",
  trabajoController.buscarPorEmpleado
);
router.get("/buscar/por-estado/:estado", trabajoController.buscarPorEstado);

// GET - Obtener trabajos por rango de fechas
router.get(
  "/buscar/por-fecha/:fechaInicio/:fechaFin",
  trabajoController.buscarPorRangoFecha
);

// PUT - Actualizar estado de trabajo
router.put("/:id/estado", trabajoController.actualizarEstado);

// POST - Asignar empleado a trabajo
router.post("/:id/asignar-empleado", trabajoController.asignarEmpleado);

// DELETE - Desasignar empleado de trabajo
router.delete(
  "/:id/desasignar-empleado/:empleadoId",
  trabajoController.desasignarEmpleado
);

// GET - Obtener empleados asignados a un trabajo
router.get("/:id/empleados", trabajoController.obtenerEmpleados);

// GET - Obtener transacciones relacionadas con un trabajo
router.get("/:id/transacciones", trabajoController.obtenerTransacciones);

// GET - Obtener estadísticas de trabajos
router.get(
  "/estadisticas/generales",
  trabajoController.obtenerEstadisticasGenerales
);

// GET - Trabajos pendientes
router.get("/estado/pendientes", trabajoController.obtenerPendientes);

// GET - Trabajos en progreso
router.get("/estado/en-progreso", trabajoController.obtenerEnProgreso);

// GET - Trabajos completados
router.get("/estado/completados", trabajoController.obtenerCompletados);

module.exports = router;
