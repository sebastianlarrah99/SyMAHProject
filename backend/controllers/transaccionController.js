const Transaccion = require("../models/Transaccion");
const Cliente = require("../models/Cliente");
const Trabajo = require("../models/Trabajo");
const Empleado = require("../models/Empleado");
const Cobro = require("../models/Cobro");
const Pago = require("../models/Pago");

// Obtener todas las transacciones
exports.obtenerTodas = async (req, res) => {
  try {
    const transacciones = await Transaccion.find();
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las transacciones", error });
  }
};

// Obtener transacción por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id);
    if (!transaccion) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaccion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transacción", error });
  }
};

// Crear nueva transacción
exports.crear = async (req, res) => {
  try {
    const { tipo, actor, actorTipo, monto, ...data } = req.body;

    // Verificar que el actor sea válido según el tipo de transacción
    if (tipo === "pago" && actorTipo === "Empleado") {
      const empleado = await Empleado.findById(actor);
      if (!empleado) {
        return res.status(400).json({
          message: "El ID del actor no corresponde a un empleado válido.",
        });
      }
      // Descontar el monto del saldo del empleado
      empleado.saldo -= monto;
      await empleado.save();
    } else if (tipo === "cobro" && actorTipo === "Trabajo") {
      const trabajo = await Trabajo.findById(actor);
      if (!trabajo) {
        return res.status(400).json({
          message: "El ID del actor no corresponde a un trabajo válido.",
        });
      }
      // Sumar el monto al acumuladoPagos del trabajo
      trabajo.acumuladoPagos += monto;
      await trabajo.save();
    } else {
      return res.status(400).json({
        message: "El tipo de transacción y el tipo de actor no coinciden.",
      });
    }

    const nuevaTransaccion = new Transaccion({
      tipo,
      actor,
      actorTipo,
      monto,
      ...data,
    });
    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la transacción", error });
  }
};

// Actualizar transacción existente
exports.actualizar = async (req, res) => {
  try {
    const transaccionActualizada = await Transaccion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaccionActualizada) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaccionActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la transacción", error });
  }
};

// Eliminar transacción
exports.eliminar = async (req, res) => {
  try {
    const transaccionEliminada = await Transaccion.findByIdAndDelete(
      req.params.id
    );
    if (!transaccionEliminada) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json({ message: "Transacción eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la transacción", error });
  }
};

// Buscar transacciones por tipo
exports.buscarPorTipo = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({ tipo: req.params.tipo });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por tipo", error });
  }
};

// Buscar transacciones por cliente
exports.buscarPorCliente = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      cliente: req.params.clienteId,
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por cliente", error });
  }
};

// Buscar transacciones por empleado
exports.buscarPorEmpleado = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      empleado: req.params.empleadoId,
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por empleado", error });
  }
};

// Buscar transacciones por trabajo
exports.buscarPorTrabajo = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      trabajo: req.params.trabajoId,
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por trabajo", error });
  }
};

// Buscar transacciones por rango de fechas
exports.buscarPorRangoFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.params;
    const transacciones = await Transaccion.find({
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar transacciones por rango de fechas",
      error,
    });
  }
};

// Buscar transacciones por rango de montos
exports.buscarPorRangoMonto = async (req, res) => {
  try {
    const { montoMin, montoMax } = req.params;
    const transacciones = await Transaccion.find({
      monto: { $gte: parseFloat(montoMin), $lte: parseFloat(montoMax) },
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar transacciones por rango de montos",
      error,
    });
  }
};

// Obtener transacciones de cobros
exports.obtenerCobros = async (req, res) => {
  try {
    const cobros = await Transaccion.find({ tipo: "cobro" });
    res.status(200).json(cobros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones de cobros", error });
  }
};

// Obtener transacciones de pagos
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Transaccion.find({ tipo: "pago" });
    res.status(200).json(pagos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones de pagos", error });
  }
};

// Obtener balance general de transacciones
exports.obtenerBalanceGeneral = async (req, res) => {
  try {
    const transacciones = await Transaccion.find();
    const balance = transacciones.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );
    res.status(200).json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el balance general", error });
  }
};

// Obtener balance por cliente
exports.obtenerBalancePorCliente = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      cliente: req.params.clienteId,
    });
    const balance = transacciones.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );
    res.status(200).json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener balance por cliente", error });
  }
};

// Obtener balance por empleado
exports.obtenerBalancePorEmpleado = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      empleado: req.params.empleadoId,
    });
    const balance = transacciones.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );
    res.status(200).json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener balance por empleado", error });
  }
};

// Obtener estadísticas generales de transacciones
exports.obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const totalTransacciones = await Transaccion.countDocuments();
    const transaccionesPorTipo = await Transaccion.aggregate([
      { $group: { _id: "$tipo", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ totalTransacciones, transaccionesPorTipo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas generales", error });
  }
};

// Obtener estadísticas por período
exports.obtenerEstadisticasPorPeriodo = async (req, res) => {
  try {
    const { periodo } = req.params; // Ejemplo: 'mensual', 'anual'
    // Implementar lógica para calcular estadísticas por período
    res.status(200).json({ message: "Estadísticas por período", periodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas por período", error });
  }
};

// Obtener transacciones pendientes de confirmación
exports.obtenerPendientes = async (req, res) => {
  try {
    const pendientes = await Transaccion.find({ estado: "pendiente" });
    res.status(200).json(pendientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones pendientes", error });
  }
};

// Confirmar transacción
exports.confirmar = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { estado: "confirmada" },
      { new: true }
    );
    if (!transaccion) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaccion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al confirmar la transacción", error });
  }
};

// Cancelar transacción
exports.cancelar = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { estado: "cancelada" },
      { new: true }
    );
    if (!transaccion) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaccion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cancelar la transacción", error });
  }
};

// Obtener resumen financiero
exports.obtenerResumenFinanciero = async (req, res) => {
  try {
    const totalCobros = await Transaccion.aggregate([
      { $match: { tipo: "cobro" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);
    const totalPagos = await Transaccion.aggregate([
      { $match: { tipo: "pago" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);
    res.status(200).json({
      totalCobros: totalCobros[0]?.total || 0,
      totalPagos: totalPagos[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el resumen financiero", error });
  }
};
