const RegistroHoras = require("../models/RegistroHoras");
const Empleado = require("../models/Empleado");
const Trabajo = require("../models/Trabajo");
const mongoose = require("mongoose");

// Tabla de tarifas por cargo
const tarifasPorCargo = {
  Gerente: 50,
  Desarrollador: 30,
  Diseñador: 25,
};

// Registrar horas trabajadas
exports.registrarHoras = async (req, res) => {
  try {
    const { empleadoId, trabajoId, horaIngreso, horaSalida } = req.body;

    // Convertir empleadoId a ObjectId
    if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
      return res
        .status(400)
        .json({ message: "El ID del empleado no es válido" });
    }

    // Verificar que el empleado exista
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

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

    // Calcular la cantidad de horas trabajadas
    const ingreso = new Date(horaIngreso);
    const salida = new Date(horaSalida);
    const horasTrabajadas = (salida - ingreso) / (1000 * 60 * 60); // Diferencia en horas

    if (horasTrabajadas <= 0) {
      return res
        .status(400)
        .json({ message: "Las horas de ingreso y salida no son válidas" });
    }

    // Calcular el monto según el cargo
    const tarifa = tarifasPorCargo[empleado.cargo];
    if (!tarifa) {
      return res
        .status(400)
        .json({ message: "Cargo del empleado no tiene tarifa definida" });
    }
    const montoCalculado = tarifa * horasTrabajadas;

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
    res.status(500).json({
      message: "Error al registrar horas",
      error: error.message || error,
    });
    console.error("Error al registrar horas:", error);
  }
};
