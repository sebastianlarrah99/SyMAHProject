const Empleado = require("../models/Empleado");
const Cargo = require("../models/Cargo"); // Importar el modelo Cargo
const Transaccion = require("../models/Transaccion"); // Importar el modelo Transaccion

// Obtener todos los empleados
exports.obtenerTodos = async (req, res) => {
  try {
    const empleados = await Empleado.find().populate("cargo"); // Incluir los datos del cargo
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los empleados", error });
  }
};

// Obtener empleado por ID
exports.obtenerPorId = async (req, res) => {
  try {
    console.log("ID recibido para obtener empleado:", req.params.id); // Log del ID recibido

    const empleado = await Empleado.findById(req.params.id).populate("cargo");
    console.log("Resultado de la consulta de empleado:", empleado); // Log del resultado de la consulta

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    if (!empleado.cargo) {
      return res.status(400).json({
        message: "El empleado no tiene un cargo asignado o el cargo no existe.",
      });
    }

    // Calcular lo pagado en el mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date();
    finMes.setMonth(finMes.getMonth() + 1);
    finMes.setDate(0);
    finMes.setHours(23, 59, 59, 999);

    const transaccionesMes = await Transaccion.find({
      actor: empleado._id,
      actorTipo: "Empleado",
      tipo: "pago",
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    const pagadoMes = transaccionesMes.reduce(
      (total, transaccion) => total + transaccion.monto,
      0
    );

    res.status(200).json({
      ...empleado.toObject(),
      pagadoMes,
    });
  } catch (error) {
    console.error("Error al obtener el empleado:", error); // Log del error
    res.status(500).json({ message: "Error al obtener el empleado", error });
  }
};

// Crear nuevo empleado
exports.crear = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body); // Log para verificar los datos recibidos

    // Buscar el cargo por su nombre
    const cargo = await Cargo.findOne({ nombre: req.body.cargo });
    if (!cargo) {
      return res.status(400).json({
        message:
          "El cargo especificado no existe. Por favor, verifica el nombre del cargo.",
      });
    }

    // Reemplazar el nombre del cargo por su ID y asegurar que el saldo inicial sea 0
    const nuevoEmpleado = new Empleado({
      ...req.body,
      cargo: cargo._id,
      saldo: 0, // Asegurar que el saldo inicial sea 0
    });

    const empleadoGuardado = await nuevoEmpleado.save();

    console.log("Empleado guardado exitosamente:", empleadoGuardado); // Log para confirmar el guardado
    res.status(201).json(empleadoGuardado);
  } catch (error) {
    console.error("Error al crear el empleado:", error.message); // Log detallado del error
    res.status(500).json({
      message: "Error al crear el empleado",
      error: error.message,
    });
  }
};

// Actualizar empleado existente
exports.actualizar = async (req, res) => {
  try {
    // Validar datos antes de actualizar
    if (!req.body.nombre || !req.body.cargo) {
      return res
        .status(400)
        .json({ message: "Nombre y cargo son obligatorios" });
    }

    // Verificar que el cargo existe
    const cargoExiste = await Cargo.findById(req.body.cargo);
    if (!cargoExiste) {
      return res
        .status(400)
        .json({ message: "El cargo proporcionado no existe" });
    }

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
    console.error("Error al actualizar el empleado:", error);
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

    // Calcular el total de los pagos
    const totalPagos = empleado.pagos.reduce(
      (total, pago) => total + pago.monto,
      0
    );

    res.status(200).json({
      pagos: empleado.pagos,
      totalPagos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los pagos del empleado", error });
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
