const Trabajo = require("../models/Trabajo");
const TrabajosXCliente = require("../models/TrabajosXCliente");
const EmpleadosXTrabajo = require("../models/EmpleadosXTrabajo");

// Obtener todos los trabajos
exports.obtenerTodos = async (req, res) => {
  try {
    const trabajos = await Trabajo.find(); // Eliminar el populate de campos inexistentes
    res.status(200).json(trabajos);
  } catch (error) {
    console.error("Error en obtenerTodos:", error);
    res.status(500).json({ message: "Error al obtener los trabajos", error });
  }
};

// Obtener trabajo por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    // Obtener clientes relacionados
    const relacionesClientes = await TrabajosXCliente.find({
      trabajo: req.params.id,
    }).populate("cliente");
    const clientes = relacionesClientes.map((relacion) => relacion.cliente);

    // Obtener empleados relacionados
    const relacionesEmpleados = await EmpleadosXTrabajo.find({
      trabajo: req.params.id,
    }).populate("empleado");
    const empleados = relacionesEmpleados.map((relacion) => relacion.empleado);

    res.status(200).json({
      trabajo,
      clientes,
      empleados,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el trabajo", error });
  }
};

// Crear nuevo trabajo
exports.crear = async (req, res) => {
  try {
    const nuevoTrabajo = new Trabajo(req.body);
    const trabajoGuardado = await nuevoTrabajo.save();
    res.status(201).json(trabajoGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el trabajo", error });
  }
};

// Actualizar trabajo existente
exports.actualizar = async (req, res) => {
  try {
    const trabajoActualizado = await Trabajo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!trabajoActualizado) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    res.status(200).json(trabajoActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el trabajo", error });
  }
};

// Eliminar trabajo
exports.eliminar = async (req, res) => {
  try {
    const trabajoEliminado = await Trabajo.findByIdAndDelete(req.params.id);
    if (!trabajoEliminado) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    res.status(200).json({ message: "Trabajo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el trabajo", error });
  }
};

// Buscar trabajos por cliente
exports.buscarPorCliente = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ cliente: req.params.clienteId });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar trabajos por cliente", error });
  }
};

// Buscar trabajos por empleado
exports.buscarPorEmpleado = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ empleados: req.params.empleadoId });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar trabajos por empleado", error });
  }
};

// Actualizar estado de trabajo
exports.actualizarEstado = async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    res.status(200).json(trabajo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del trabajo", error });
  }
};

// Buscar trabajos por estado
exports.buscarPorEstado = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ estado: req.params.estado });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar trabajos por estado", error });
  }
};

// Buscar trabajos por rango de fechas
exports.buscarPorRangoFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.params;
    const trabajos = await Trabajo.find({
      fechaInicio: { $gte: new Date(fechaInicio) },
      fechaFin: { $lte: new Date(fechaFin) },
    });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar trabajos por rango de fechas", error });
  }
};

// Asignar empleado a trabajo
exports.asignarEmpleado = async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    trabajo.empleados.push(req.body.empleadoId);
    await trabajo.save();
    res.status(200).json(trabajo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al asignar empleado al trabajo", error });
  }
};

// Desasignar empleado de trabajo
exports.desasignarEmpleado = async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id);
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    trabajo.empleados = trabajo.empleados.filter(
      (empleadoId) => empleadoId.toString() !== req.params.empleadoId
    );
    await trabajo.save();
    res.status(200).json(trabajo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desasignar empleado del trabajo", error });
  }
};

// Obtener clientes relacionados con un trabajo
exports.obtenerClientes = async (req, res) => {
  try {
    const relaciones = await TrabajosXCliente.find({
      trabajo: req.params.id,
    }).populate("cliente");
    const clientes = relaciones.map((relacion) => relacion.cliente);
    res.status(200).json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los clientes del trabajo", error });
  }
};

// Obtener empleados relacionados con un trabajo
exports.obtenerEmpleados = async (req, res) => {
  try {
    const relaciones = await EmpleadosXTrabajo.find({
      trabajo: req.params.id,
    }).populate("empleado");
    const empleados = relaciones.map((relacion) => relacion.empleado);
    res.status(200).json(empleados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los empleados del trabajo", error });
  }
};

// Obtener transacciones relacionadas con un trabajo
exports.obtenerTransacciones = async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id).populate(
      "transacciones"
    );
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }
    res.status(200).json(trabajo.transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones del trabajo", error });
  }
};

// Obtener estadísticas generales de trabajos
exports.obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const totalTrabajos = await Trabajo.countDocuments();
    const trabajosPorEstado = await Trabajo.aggregate([
      { $group: { _id: "$estado", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ totalTrabajos, trabajosPorEstado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas generales", error });
  }
};

// Obtener trabajos pendientes
exports.obtenerPendientes = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ estado: "pendiente" });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener trabajos pendientes", error });
  }
};

// Obtener trabajos en progreso
exports.obtenerEnProgreso = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ estado: "en progreso" });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener trabajos en progreso", error });
  }
};

// Obtener trabajos completados
exports.obtenerCompletados = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ estado: "completado" });
    res.status(200).json(trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener trabajos completados", error });
  }
};
