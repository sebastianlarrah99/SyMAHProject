const express = require("express");
const router = express.Router();
const transaccionController = require("../controllers/transaccionController");

// CRUD Operations para Transacciones

// GET - Obtener todas las transacciones (Read - Consulta)
router.get("/", transaccionController.obtenerTodas);

// GET - Obtener transacción por ID (Read - Consulta específica)
router.get("/:id", transaccionController.obtenerPorId);

// POST - Crear nueva transacción (Create - Alta)
router.post("/", transaccionController.crear);

// PUT - Actualizar transacción existente (Update - Modificación)
router.put("/:id", transaccionController.actualizar);

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

// GET - Obtener transacciones por rango de montos
router.get(
  "/buscar/por-monto/:montoMin/:montoMax",
  transaccionController.buscarPorRangoMonto
);

// GET - Transacciones de cobros
router.get("/tipo/cobros", transaccionController.obtenerCobros);

// GET - Transacciones de pagos
router.get("/tipo/pagos", transaccionController.obtenerPagos);

// GET - Obtener balance de transacciones
router.get("/balance/general", transaccionController.obtenerBalanceGeneral);

// GET - Obtener balance por cliente
router.get(
  "/balance/por-cliente/:clienteId",
  transaccionController.obtenerBalancePorCliente
);

// GET - Obtener balance por empleado
router.get(
  "/balance/por-empleado/:empleadoId",
  transaccionController.obtenerBalancePorEmpleado
);

// GET - Obtener estadísticas de transacciones
router.get(
  "/estadisticas/generales",
  transaccionController.obtenerEstadisticasGenerales
);

// GET - Obtener estadísticas por período
router.get(
  "/estadisticas/por-periodo/:periodo",
  transaccionController.obtenerEstadisticasPorPeriodo
);

// GET - Transacciones pendientes de confirmación
router.get("/estado/pendientes", transaccionController.obtenerPendientes);

// PUT - Confirmar transacción
router.put("/:id/confirmar", transaccionController.confirmar);

// PUT - Cancelar transacción
router.put("/:id/cancelar", transaccionController.cancelar);

// GET - Resumen financiero
router.get(
  "/resumen/financiero",
  transaccionController.obtenerResumenFinanciero
);

module.exports = router;
