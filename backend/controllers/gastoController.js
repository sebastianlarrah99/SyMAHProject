const Transaccion = require("../models/Transaccion");

// Crear un nuevo gasto
const crearGasto = async (req, res) => {
  try {
    const { monto, fecha, descripcion } = req.body;

    const nuevoGasto = new Transaccion({
      tipo: "gasto",
      monto,
      fecha,
      descripcion,
    });

    const gastoGuardado = await nuevoGasto.save();
    res.status(201).json(gastoGuardado);
  } catch (error) {
    console.error("Error al crear el gasto:", error);
    res.status(500).json({ message: "Error al crear el gasto" });
  }
};

// Obtener todos los gastos
const obtenerGastos = async (req, res) => {
  try {
    const gastos = await Transaccion.find({ tipo: "gasto" });
    res.status(200).json(gastos);
  } catch (error) {
    console.error("Error al obtener los gastos:", error);
    res.status(500).json({ message: "Error al obtener los gastos" });
  }
};

// Eliminar un gasto por ID
const eliminarGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gastoEliminado = await Transaccion.findByIdAndDelete(id);

    if (!gastoEliminado) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    res.status(200).json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    res.status(500).json({ message: "Error al eliminar el gasto" });
  }
};

// Calcular gastos por mes desde la colección Transaccion
const calcularGastosPorMes = async (req, res) => {
  try {
    // Verificar si hay transacciones de tipo gasto
    const transaccionesGasto = await Transaccion.find({ tipo: "gasto" });
    console.log("Transacciones de tipo gasto:", transaccionesGasto);

    if (transaccionesGasto.length === 0) {
      console.warn("No se encontraron transacciones de tipo gasto.");
      return res
        .status(404)
        .json({ message: "No se encontraron transacciones de tipo gasto." });
    }

    const gastosPorMes = await Transaccion.aggregate([
      {
        $match: { tipo: "gasto" }, // Filtrar solo transacciones de tipo gasto
      },
      {
        $group: {
          _id: { $month: "$fecha" },
          totalGastos: { $sum: "$monto" },
        },
      },
      {
        $project: {
          mes: "$_id",
          totalGastos: 1,
          _id: 0,
        },
      },
      { $sort: { mes: 1 } },
    ]);

    res.status(200).json(gastosPorMes);
  } catch (error) {
    console.error(
      "Error al calcular los gastos por mes desde Transaccion:",
      error
    );
    res.status(500).json({
      message: "Error al calcular los gastos por mes",
      error: error.message,
    });
  }
};

module.exports = {
  crearGasto,
  obtenerGastos,
  eliminarGasto,
  calcularGastosPorMes,
};
