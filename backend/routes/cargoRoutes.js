const express = require("express");
const router = express.Router();
const cargoController = require("../controllers/cargoController");

// CRUD Operations para Cargos

// Obtener todos los cargos
router.get("/", cargoController.obtenerTodos);

// Crear nuevo cargo
router.post("/", cargoController.crear);

// Actualizar cargo existente
router.put("/:id", cargoController.actualizar);

// Eliminar cargo
router.delete("/:id", cargoController.eliminar);

module.exports = router;
