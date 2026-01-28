const Presupuesto = require("../models/Presupuesto");
const fs = require("fs");
const path = require("path");

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
      "_id cliente direccion total pdf",
    );
    res.json(
      presupuestos.map((presupuesto) => ({
        id: presupuesto._id,
        cliente: presupuesto.cliente,
        direccion: presupuesto.direccion,
        total: presupuesto.total,
        pdf: presupuesto.pdf, // Incluir la ruta del archivo PDF
      })),
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

// Subir un archivo PDF asociado a un presupuesto
const subirArchivoPDF = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo" });
    }

    const presupuesto = await Presupuesto.findById(id);
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }

    // Crear carpeta de almacenamiento si no existe
    const storageDir = path.join(__dirname, "..", "uploads", "presupuestos");
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Mover el archivo a la carpeta de almacenamiento
    const newFilePath = path.join(storageDir, req.file.filename);
    fs.renameSync(req.file.path, newFilePath);

    // Guardar la ruta del archivo en el presupuesto
    presupuesto.pdf = `/uploads/presupuestos/${req.file.filename}`;
    await presupuesto.save();

    res.status(200).json({ pdfUrl: presupuesto.pdf });
  } catch (error) {
    res.status(500).json({
      error: "Error al subir el archivo PDF",
      detalles: error.message,
    });
  }
};

module.exports = {
  crearPresupuesto,
  obtenerPresupuestos,
  eliminarPresupuesto,
  obtenerPresupuestoPorId,
  subirArchivoPDF,
};
