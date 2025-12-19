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

// GET - Obtener trabajos por estado específico
router.get("/estado/pendientes", trabajoController.obtenerPendientes);
router.get("/estado/en-progreso", trabajoController.obtenerEnProgreso);
router.get("/estado/completados", trabajoController.obtenerCompletados);
router.get("/estado/activos", trabajoController.obtenerActivos);

// PUT - Actualizar ganancias de un trabajo
router.put("/:id/actualizar-ganancias", trabajoController.actualizarGanancias);

module.exports = router;
