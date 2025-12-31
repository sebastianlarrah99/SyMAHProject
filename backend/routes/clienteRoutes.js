const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

// CRUD Operations para Clientes

// GET - Obtener todos los clientes (Read - Consulta)
router.get("/", clienteController.obtenerTodos);

// GET - Obtener cliente por ID (Read - Consulta específica)
router.get("/:id", clienteController.obtenerPorId);

// POST - Crear nuevo cliente (Create - Alta)
router.post("/", clienteController.crear);

// PUT - Actualizar cliente existente (Update - Modificación)
router.put("/:id", clienteController.actualizar);

// DELETE - Eliminar cliente (Delete - Baja)
router.delete("/:id", clienteController.eliminar);

// GET - Obtener trabajos de un cliente específico
router.get("/:id/trabajos", clienteController.obtenerTrabajos);

// GET - Obtener trabajos de un cliente con detalles
router.get(
  "/:id/trabajos-detalles",
  clienteController.obtenerTrabajosConDetalles
);

module.exports = router;
