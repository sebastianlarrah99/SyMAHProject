const Empleado = require("../models/Empleado");

// Obtener todos los empleados
exports.obtenerTodos = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los empleados", error });
  }
};

// Obtener empleado por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el empleado", error });
  }
};

// Crear nuevo empleado
exports.crear = async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const empleadoGuardado = await nuevoEmpleado.save();
    res.status(201).json(empleadoGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el empleado", error });
  }
};

// Actualizar empleado existente
exports.actualizar = async (req, res) => {
  try {
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!empleadoActualizado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleadoActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el empleado", error });
  }
};

// Eliminar empleado
exports.eliminar = async (req, res) => {
  try {
    const empleadoEliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleadoEliminado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el empleado", error });
  }
};

// Buscar empleados por nombre
exports.buscarPorNombre = async (req, res) => {
  try {
    const empleados = await Empleado.find({
      nombre: new RegExp(req.params.nombre, "i"),
    });
    res.status(200).json(empleados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar empleados por nombre", error });
  }
};

// Buscar empleados por cargo
exports.buscarPorCargo = async (req, res) => {
  try {
    const empleados = await Empleado.find({ cargo: req.params.cargo });
    res.status(200).json(empleados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar empleados por cargo", error });
  }
};

// Obtener trabajos asignados a un empleado
exports.obtenerTrabajos = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).populate(
      "trabajos"
    );
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleado.trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los trabajos del empleado", error });
  }
};

// Obtener pagos recibidos por un empleado
exports.obtenerPagos = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id).populate("pagos");
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleado.pagos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los pagos del empleado", error });
  }
};

// Obtener estadísticas de un empleado
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Aquí puedes agregar lógica para calcular estadísticas específicas del empleado
    res.status(200).json({
      message: "Estadísticas del empleado",
      empleadoId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las estadísticas del empleado",
      error,
    });
  }
};

// Actualizar estado de empleado (activo/inactivo)
exports.actualizarEstado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json(empleado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del empleado", error });
  }
};

// Obtener empleados activos
exports.obtenerActivos = async (req, res) => {
  try {
    const empleados = await Empleado.find({ estado: "activo" });
    res.status(200).json(empleados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener empleados activos", error });
  }
};

// Obtener empleados inactivos
exports.obtenerInactivos = async (req, res) => {
  try {
    const empleados = await Empleado.find({ estado: "inactivo" });
    res.status(200).json(empleados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener empleados inactivos", error });
  }
};
