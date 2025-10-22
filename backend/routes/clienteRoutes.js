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

// GET - Buscar clientes por criterios específicos
router.get("/buscar/por-nombre/:nombre", clienteController.buscarPorNombre);

// GET - Obtener trabajos de un cliente específico
router.get("/:id/trabajos", clienteController.obtenerTrabajos);

// GET - Obtener estadísticas de un cliente
router.get("/:id/estadisticas", clienteController.obtenerEstadisticas);

module.exports = router;
