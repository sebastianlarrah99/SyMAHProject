const Gasto = require("../models/Gasto");

// Crear un nuevo gasto
const crearGasto = async (req, res) => {
  try {
    const { monto, fecha, descripcion } = req.body;

    const nuevoGasto = new Gasto({
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
    const gastos = await Gasto.find();
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
    const gastoEliminado = await Gasto.findByIdAndDelete(id);

    if (!gastoEliminado) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    res.status(200).json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    res.status(500).json({ message: "Error al eliminar el gasto" });
  }
};

module.exports = {
  crearGasto,
  obtenerGastos,
  eliminarGasto,
};
