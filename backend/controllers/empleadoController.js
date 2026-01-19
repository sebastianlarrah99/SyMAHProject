const Empleado = require("../models/Empleado");
const Cargo = require("../models/Cargo"); // Importar el modelo Cargo
const { Transaccion } = require("../models/Transaccion"); // Importar el modelo Transaccion
const mongoose = require("mongoose"); // Importar mongoose para validar ObjectId

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
    const empleadoId = req.params.id;

    // Validar que el ID recibido sea un ID válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
      console.error("ID inválido recibido:", empleadoId);
      return res.status(400).json({ message: "ID inválido" });
    }

    console.log("ID recibido para obtener empleado:", empleadoId); // Log del ID recibido

    const empleado = await Empleado.findById(empleadoId).populate("cargo");
    console.log("Resultado de la consulta de empleado:", empleado); // Log del resultado de la consulta

    if (!empleado) {
      console.error("Empleado no encontrado para el ID:", empleadoId);
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    if (!empleado.cargo) {
      console.error(
        "El empleado no tiene un cargo asignado o el cargo no existe:",
        empleado
      );
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

    console.log("Rango de fechas para transacciones:", inicioMes, finMes);

    const transaccionesMes = await Transaccion.find({
      actor: empleado._id,
      actorTipo: "Empleado",
      tipo: "pago",
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    console.log(
      "Transacciones encontradas para el empleado:",
      transaccionesMes
    );

    console.log("Datos utilizados para la consulta de transacciones:", {
      actor: empleado._id,
      actorTipo: "Empleado",
      tipo: "pago",
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    if (transaccionesMes.length === 0) {
      console.warn(
        "No se encontraron transacciones para el empleado en el mes actual."
      );
    }

    const pagadoMes = transaccionesMes.reduce(
      (total, transaccion) => total + transaccion.monto,
      0
    );

    console.log("Monto total pagado en el mes:", pagadoMes);

    res.status(200).json({
      ...empleado.toObject(),
      pagadoMes,
    });
  } catch (error) {
    console.error("Error al obtener el empleado:", error); // Log del error

    // Respuesta más detallada para el cliente
    res.status(500).json({
      message:
        "Error interno al obtener el empleado. Por favor, revisa los logs.",
      error: error.message,
    });
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

// Obtener pagos a empleados por mes
exports.obtenerPagosPorMes = async (req, res) => {
  try {
    const pagosPorMes = await Transaccion.aggregate([
      {
        $match: { tipo: "pago", actorTipo: "Empleado" }, // Filtrar solo transacciones de tipo "pago" para empleados
      },
      {
        $group: {
          _id: { mes: { $month: "$fecha" } }, // Agrupar por mes de la fecha
          pagos: { $sum: "$monto" }, // Sumar el monto de los pagos
        },
      },
      {
        $project: {
          mes: "$_id.mes",
          pagos: 1,
          _id: 0,
        },
      },
      {
        $sort: { mes: 1 }, // Ordenar por mes
      },
    ]);

    res.status(200).json(pagosPorMes);
  } catch (error) {
    console.error("Error al obtener los pagos a empleados por mes:", error);
    res.status(500).json({
      mensaje: "Error al obtener los pagos a empleados por mes",
    });
  }
};

// Calcular el total de pagos a todos los empleados
exports.calcularTotalPagos = async (req, res) => {
  try {
    const empleados = await Empleado.find();

    // Obtener todas las transacciones asociadas a empleados
    const transacciones = await Transaccion.find({
      actorTipo: "Empleado",
      tipo: "pago",
    });

    // Crear un mapa para sumar los pagos por empleado
    const pagosPorEmpleado = transacciones.reduce((acc, transaccion) => {
      const empleadoId = transaccion.actor.toString();
      acc[empleadoId] = (acc[empleadoId] || 0) + transaccion.monto;
      return acc;
    }, {});

    // Calcular el total de pagos
    const totalPagos = Object.values(pagosPorEmpleado).reduce(
      (acc, monto) => acc + monto,
      0
    );

    console.log("Pagos por empleado:", pagosPorEmpleado);
    console.log("Total de pagos a todos los empleados:", totalPagos);

    res.status(200).json({ totalPagos });
  } catch (error) {
    console.error("Error al calcular el total de pagos a empleados:", error);
    res.status(500).json({
      message: "Error al calcular el total de pagos a empleados",
      error: error.message,
    });
  }
};
