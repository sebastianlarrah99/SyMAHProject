const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configurar multer para aceptar solo archivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}.pdf`); // Asegurar que el archivo tenga extensión .pdf
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({ storage, fileFilter });

const {
  crearPresupuesto,
  obtenerPresupuestos,
  eliminarPresupuesto,
  obtenerPresupuestoPorId,
  subirArchivoPDF,
} = require("../controllers/presupuestoController");

// Ruta para crear un presupuesto
router.post("/", crearPresupuesto);

// Ruta para obtener todos los presupuestos
router.get("/", obtenerPresupuestos);

// Ruta para obtener un presupuesto por ID
router.get("/:id", obtenerPresupuestoPorId);

// Ruta para eliminar un presupuesto por ID
router.delete("/:id", eliminarPresupuesto);

// Ruta para subir un archivo PDF asociado a un presupuesto
router.post("/:id/upload-pdf", upload.single("pdf"), subirArchivoPDF);

module.exports = router;
