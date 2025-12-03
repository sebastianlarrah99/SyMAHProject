const express = require("express");
const router = express.Router();
const transaccionController = require("../controllers/transaccionController");

// Rutas específicas deben ir antes de las rutas dinámicas

// GET - Transacciones de cobros
router.get("/tipo/cobros", transaccionController.obtenerCobros);

// GET - Transacciones de pagos
router.get("/tipo/pagos", transaccionController.obtenerPagos);

// GET - Obtener estadísticas generales
router.get(
  "/estadisticas/generales",
  transaccionController.obtenerEstadisticasGenerales
);

// GET - Obtener estadísticas por período
router.get(
  "/estadisticas/periodo/:periodo",
  transaccionController.obtenerEstadisticasPorPeriodo
);

// GET - Obtener transacciones pendientes
router.get("/pendientes", transaccionController.obtenerPendientes);

// PUT - Confirmar transacción
router.put("/confirmar/:id", transaccionController.confirmar);

// PUT - Cancelar transacción
router.put("/cancelar/:id", transaccionController.cancelar);

// GET - Obtener resumen financiero
router.get(
  "/resumen-financiero",
  transaccionController.obtenerResumenFinanciero
);

// CRUD Operations para Transacciones

// GET - Obtener todas las transacciones (Read - Consulta)
router.get("/", transaccionController.obtenerTodas);

// GET - Obtener transacción por ID (Read - Consulta específica)
router.get(
  "/:id",
  (req, res, next) => {
    console.log("Ruta: /:id con ID:", req.params.id);
    next();
  },
  transaccionController.obtenerPorId
);

// POST - Crear nueva transacción (Create - Alta)
router.post("/", transaccionController.crear);

// DELETE - Eliminar transacción (Delete - Baja)
router.delete("/:id", transaccionController.eliminar);

// GET - Buscar transacciones por criterios específicos
router.get("/buscar/por-tipo/:tipo", transaccionController.buscarPorTipo);
router.get(
  "/buscar/por-cliente/:clienteId",
  transaccionController.buscarPorCliente
);
router.get(
  "/buscar/por-empleado/:empleadoId",
  transaccionController.buscarPorEmpleado
);
router.get(
  "/buscar/por-trabajo/:trabajoId",
  transaccionController.buscarPorTrabajo
);

// GET - Obtener transacciones por rango de fechas
router.get(
  "/buscar/por-fecha/:fechaInicio/:fechaFin",
  transaccionController.buscarPorRangoFecha
);

// Restaurar rutas eliminadas
router.get(
  "/buscar/rango-monto/:montoMin/:montoMax",
  transaccionController.buscarPorRangoMonto
);

module.exports = router;
