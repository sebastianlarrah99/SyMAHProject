const RegistroHoras = require("../models/RegistroHoras");
const Empleado = require("../models/Empleado");
const Trabajo = require("../models/Trabajo");
const mongoose = require("mongoose");

// Registrar horas trabajadas
exports.registrarHoras = async (req, res) => {
  try {
    const { empleadoId, trabajoId, horaIngreso, horaSalida } = req.body;
    console.log("Datos recibidos para registrar horas:", req.body);

    // Convertir empleadoId a ObjectId
    if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
      console.warn("ID del empleado no es válido:", empleadoId);
      return res
        .status(400)
        .json({ message: "El ID del empleado no es válido" });
    }

    // Verificar que el empleado exista y cargar su cargo
    const empleado = await Empleado.findById(empleadoId).populate("cargo");
    if (!empleado) {
      console.warn("Empleado no encontrado:", empleadoId);
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Verificar que el trabajo exista
    if (!mongoose.Types.ObjectId.isValid(trabajoId)) {
      console.warn("ID del trabajo no es válido:", trabajoId);
      return res
        .status(400)
        .json({ message: "El ID del trabajo no es válido" });
    }
    const trabajo = await Trabajo.findById(trabajoId);
    if (!trabajo) {
      console.warn("Trabajo no encontrado:", trabajoId);
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    // Calcular la cantidad de horas trabajadas
    const ingreso = new Date(horaIngreso);
    const salida = new Date(horaSalida);
    const horasTrabajadas = (salida - ingreso) / (1000 * 60 * 60); // Diferencia en horas

    console.log("Horas trabajadas calculadas:", horasTrabajadas);

    if (horasTrabajadas <= 0) {
      console.warn("Horas de ingreso y salida no válidas:", {
        horaIngreso,
        horaSalida,
      });
      return res
        .status(400)
        .json({ message: "Las horas de ingreso y salida no son válidas" });
    }

    // Calcular el monto según el pagoPorHora del cargo
    const tarifa = empleado.cargo.pagoPorHora;
    if (!tarifa) {
      console.warn(
        "El cargo del empleado no tiene definido un pago por hora:",
        empleado.cargo
      );
      return res.status(400).json({
        message: "El cargo del empleado no tiene definido un pago por hora",
      });
    }
    const montoCalculado = tarifa * horasTrabajadas;

    console.log("Monto calculado:", montoCalculado);

    // Crear el registro de horas
    const registro = new RegistroHoras({
      empleado: empleadoId,
      trabajo: trabajoId,
      horaIngreso,
      horaSalida,
      montoCalculado,
    });
    await registro.save();

    // Actualizar el saldo del empleado
    empleado.saldo += montoCalculado;
    await empleado.save();

    // Actualizar el gasto en mano de obra del trabajo
    trabajo.gastoManoObra += montoCalculado;
    await trabajo.save();

    res
      .status(201)
      .json({ message: "Horas registradas correctamente", registro });
  } catch (error) {
    console.error("Error al registrar horas:", error);
    res.status(500).json({
      message: "Error al registrar horas",
      error: error.message || error,
    });
  }
};

// Obtener horarios registrados por empleado
exports.obtenerPorEmpleado = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    // Verificar que el empleado exista
    if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
      return res
        .status(400)
        .json({ message: "El ID del empleado no es válido" });
    }

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Obtener los registros de horas del empleado
    const registros = await RegistroHoras.find({
      empleado: empleadoId,
    }).populate("trabajo");

    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los horarios del empleado",
      error: error.message || error,
    });
    console.error("Error al obtener los horarios del empleado:", error);
  }
};

// Obtener horarios registrados por trabajo
exports.obtenerPorTrabajo = async (req, res) => {
  try {
    const { trabajoId } = req.params;

    // Verificar que el trabajo exista
    if (!mongoose.Types.ObjectId.isValid(trabajoId)) {
      return res
        .status(400)
        .json({ message: "El ID del trabajo no es válido" });
    }

    const trabajo = await Trabajo.findById(trabajoId);
    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    // Obtener los registros de horas del trabajo
    const registros = await RegistroHoras.find({ trabajo: trabajoId }).populate(
      "empleado"
    );

    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los horarios del trabajo",
      error: error.message || error,
    });
    console.error("Error al obtener los horarios del trabajo:", error);
  }
};

// Eliminar un registro de horas
exports.eliminarRegistroHoras = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "El ID del registro no es válido" });
    }

    // Buscar el registro antes de eliminarlo
    const registro = await RegistroHoras.findById(id).populate(
      "empleado trabajo"
    );
    if (!registro) {
      return res
        .status(404)
        .json({ message: "Registro de horas no encontrado" });
    }

    // Actualizar el saldo del empleado
    const empleado = registro.empleado;
    if (empleado) {
      empleado.saldo -= registro.montoCalculado;
      await empleado.save();
    }

    // Actualizar el gasto en mano de obra del trabajo
    const trabajo = registro.trabajo;
    if (trabajo) {
      trabajo.gastoManoObra -= registro.montoCalculado;
      await trabajo.save();
    }

    // Eliminar el registro de horas
    await RegistroHoras.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Registro de horas eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el registro de horas",
      error: error.message || error,
    });
    console.error("Error al eliminar el registro de horas:", error);
  }
};
