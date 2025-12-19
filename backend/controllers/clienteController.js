const Cliente = require("../models/Cliente");
const Trabajo = require("../models/Trabajo");

// Obtener todos los clientes
exports.obtenerTodos = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Obtener cliente por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};

// Crear nuevo cliente
exports.crear = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

// Actualizar cliente existente
exports.actualizar = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error });
  }
};

// Eliminar cliente
exports.eliminar = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error });
  }
};

// Obtener trabajos de un cliente específico
exports.obtenerTrabajos = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate("trabajos");
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente.trabajos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los trabajos del cliente", error });
  }
};

// Obtener transacciones de un cliente específico
exports.obtenerTransacciones = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate(
      "transacciones"
    );
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente.transacciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las transacciones del cliente",
      error,
    });
  }
};

// Obtener trabajos de un cliente con pagos y gastos de mano de obra
exports.obtenerTrabajosConDetalles = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ cliente: req.params.id });

    if (!trabajos || trabajos.length === 0) {
      return res.status(200).json({
        message: "No se encontraron trabajos asociados a este cliente.",
      });
    }

    const trabajosConDetalles = trabajos.map((trabajo) => {
      return {
        titulo: trabajo.titulo,
        descripcion: trabajo.descripcion,
        totalPagos: trabajo.acumuladoPagos,
        totalGastosManoObra: trabajo.gastoManoObra,
      };
    });

    res.status(200).json(trabajosConDetalles);
  } catch (error) {
    console.error(
      "Error al obtener los trabajos con detalles del cliente:",
      error
    );
    res.status(500).json({
      message: "Error al obtener los trabajos con detalles del cliente",
      error,
    });
  }
};
