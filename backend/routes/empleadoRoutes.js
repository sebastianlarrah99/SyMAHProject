const express = require("express");
const router = express.Router();
const empleadoController = require("../controllers/empleadoController");

// CRUD Operations para Empleados

// GET - Obtener todos los empleados (Read - Consulta)
router.get("/", empleadoController.obtenerTodos);

// GET - Obtener empleado por ID (Read - Consulta específica)
router.get("/:id", empleadoController.obtenerPorId);

// POST - Crear nuevo empleado (Create - Alta)
router.post("/", empleadoController.crear);

// PUT - Actualizar empleado existente (Update - Modificación)
router.put("/:id", empleadoController.actualizar);

// DELETE - Eliminar empleado (Delete - Baja)
router.delete("/:id", empleadoController.eliminar);

// GET - Obtener trabajos asignados a un empleado
router.get("/:id/trabajos", empleadoController.obtenerTrabajos);

// GET - Obtener pagos recibidos por un empleado
router.get("/:id/pagos", empleadoController.obtenerPagos);

// PUT - Actualizar estado de empleado (activo/inactivo)
router.put("/:id/estado", empleadoController.actualizarEstado);

// Obtener empleados (por estado)
router.get("/", async (req, res) => {
  const { estado } = req.query; // Query param para filtrar por estado
  try {
    const filtro = estado ? { estado } : { estado: "activo" }; // Por defecto, solo activos
    const empleados = await Empleado.find(filtro);
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error });
  }
});

// Cambiar estado de empleado (activo/inactivo)
router.put("/inactivar/:id", empleadoController.actualizarEstado);

// Eliminar definitivamente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findById(id);
    if (empleado.estado === "inactivo") {
      await empleado.deleteOne();
      res.json({ message: "Empleado eliminado definitivamente" });
    } else {
      res.status(400).json({
        message: "Solo se pueden eliminar empleados inactivos",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado", error });
  }
});

module.exports = router;
