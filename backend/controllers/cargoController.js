const Cargo = require("../models/Cargo");

// Obtener todos los cargos
exports.obtenerTodos = async (req, res) => {
  try {
    const cargos = await Cargo.find();
    res.status(200).json(cargos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cargos", error });
  }
};

// Crear nuevo cargo
exports.crear = async (req, res) => {
  try {
    const nuevoCargo = new Cargo(req.body);
    const cargoGuardado = await nuevoCargo.save();
    res.status(201).json(cargoGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cargo", error });
  }
};

// Actualizar cargo existente
exports.actualizar = async (req, res) => {
  try {
    const cargoActualizado = await Cargo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cargoActualizado) {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }
    res.status(200).json(cargoActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cargo", error });
  }
};

// Eliminar cargo
exports.eliminar = async (req, res) => {
  try {
    const cargoEliminado = await Cargo.findByIdAndDelete(req.params.id);
    if (!cargoEliminado) {
      return res.status(404).json({ message: "Cargo no encontrado" });
    }
    res.status(200).json({ message: "Cargo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cargo", error });
  }
};
