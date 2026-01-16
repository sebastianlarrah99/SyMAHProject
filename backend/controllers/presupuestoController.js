const Presupuesto = require("../models/Presupuesto");

// Crear un nuevo presupuesto
const crearPresupuesto = async (req, res) => {
  try {
    console.log("Datos recibidos para crear presupuesto:", req.body);
    const nuevoPresupuesto = new Presupuesto(req.body);
    const presupuestoGuardado = await nuevoPresupuesto.save();
    res.status(201).json(presupuestoGuardado);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el presupuesto",
      detalles: error.message,
    });
  }
};

// Obtener todos los presupuestos
const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().select(
      "_id cliente direccion total"
    );
    res.json(
      presupuestos.map((presupuesto) => ({
        id: presupuesto._id,
        cliente: presupuesto.cliente,
        direccion: presupuesto.direccion,
        total: presupuesto.total,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los presupuestos" });
  }
};

// Eliminar un presupuesto por ID
const eliminarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    await Presupuesto.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el presupuesto" });
  }
};

// Obtener un presupuesto por ID
const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuesto = await Presupuesto.findById(id);
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el presupuesto",
      detalles: error.message,
    });
  }
};

module.exports = {
  crearPresupuesto,
  obtenerPresupuestos,
  eliminarPresupuesto,
  obtenerPresupuestoPorId,
};
