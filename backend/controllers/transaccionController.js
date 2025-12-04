const Transaccion = require("../models/Transaccion");
const Cliente = require("../models/Cliente");
const Trabajo = require("../models/Trabajo");
const Empleado = require("../models/Empleado");
const Cobro = require("../models/Cobro");
const Pago = require("../models/Pago");

// Obtener todas las transacciones
exports.obtenerTodas = async (req, res) => {
  try {
    const { year, month } = req.query;
    let filtro = {};

    if (year) {
      filtro.fecha = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    if (year && month) {
      const inicioMes = new Date(`${year}-${month}-01`);
      const finMes = new Date(`${year}-${month}-01`);
      finMes.setMonth(finMes.getMonth() + 1);
      filtro.fecha = { $gte: inicioMes, $lt: finMes };
    }

    const transacciones = await Transaccion.find(filtro);
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las transacciones", error });
  }
};

// Obtener transacción por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id);
    if (!transaccion) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    res.status(200).json(transaccion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transacción", error });
  }
};

// Crear nueva transacción
exports.crear = async (req, res) => {
  try {
    const { tipo, actor, actorTipo, monto, ...data } = req.body;

    // Validar que el monto sea un número válido
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      console.error("Monto inválido recibido:", monto);
      return res.status(400).json({
        message: "El monto debe ser un número válido y mayor a 0.",
      });
    }

    // Normalizar valores de tipo para aceptar "Ingreso" y "Egreso"
    const normalizedTipo =
      tipo === "Ingreso" ? "cobro" : tipo === "Egreso" ? "pago" : tipo;

    // Verificar que el actor sea válido según el tipo de transacción
    if (normalizedTipo === "pago" && actorTipo === "Empleado") {
      const empleado = await Empleado.findById(actor);
      if (!empleado) {
        console.error("Empleado no encontrado para el ID:", actor);
        return res.status(400).json({
          message: "El ID del actor no corresponde a un empleado válido.",
        });
      }
      empleado.saldo -= montoNumerico; // Restar el monto al saldo
      empleado.pagado = (empleado.pagado || 0) + montoNumerico; // Acumular en pagado
      await empleado.save();
    } else if (normalizedTipo === "cobro" && actorTipo === "Trabajo") {
      const trabajo = await Trabajo.findById(actor);
      if (!trabajo) {
        console.error("Trabajo no encontrado para el ID:", actor);
        return res.status(400).json({
          message: "El ID del actor no corresponde a un trabajo válido.",
        });
      }
      trabajo.acumuladoPagos = (trabajo.acumuladoPagos || 0) + montoNumerico;
      await trabajo.save();

      // Actualizar las ganancias del trabajo
      trabajo.ganancias = trabajo.acumuladoPagos - trabajo.gastoManoObra;
      await trabajo.save();
    } else {
      console.error("Tipo de transacción o actor inválido:", {
        tipo: normalizedTipo,
        actorTipo,
      });
      return res.status(400).json({
        message: "El tipo de transacción y el tipo de actor no coinciden.",
      });
    }

    const nuevaTransaccion = new Transaccion({
      tipo: normalizedTipo,
      actor,
      actorTipo,
      monto: montoNumerico,
      ...data,
    });
    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    res.status(500).json({ message: "Error al crear la transacción", error });
  }
};

// Eliminar transacción
exports.eliminar = async (req, res) => {
  try {
    const transaccionEliminada = await Transaccion.findByIdAndDelete(
      req.params.id
    );
    if (!transaccionEliminada) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }

    const { actor, actorTipo, tipo, monto } = transaccionEliminada;

    console.log("Transacción eliminada:", transaccionEliminada);

    // Ajustar los efectos de la transacción eliminada directamente
    if (actorTipo === "Empleado" && tipo === "pago") {
      const empleado = await Empleado.findById(actor);
      if (empleado) {
        console.log("Empleado antes de eliminar transacción:", empleado);
        empleado.saldo += monto; // Ajustar el saldo
        empleado.pagado -= monto; // Ajustar el pagado
        await empleado.save();
        console.log("Empleado después de eliminar transacción:", empleado);
      }
    } else if (actorTipo === "Trabajo" && tipo === "cobro") {
      const trabajo = await Trabajo.findById(actor);
      if (trabajo) {
        trabajo.acumuladoPagos -= monto; // Ajustar el acumulado de pagos
        await trabajo.save();
      }
    }

    // Obtener las transacciones actualizadas del empleado
    const { mes, anio } = req.query;
    let filtro = { empleado: actor };

    if (mes && anio) {
      const mesFormateado = mes.padStart(2, "0"); // Asegurar que el mes tenga dos dígitos
      filtro.fecha = {
        $gte: new Date(`${anio}-${mesFormateado}-01T00:00:00.000Z`),
        $lte: new Date(`${anio}-${mesFormateado}-31T23:59:59.999Z`),
      };
    }

    const transaccionesActualizadas = await Transaccion.find(filtro);

    res.status(200).json({
      message: "Transacción eliminada correctamente",
      transacciones: transaccionesActualizadas,
    });
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar la transacción", error });
  }
};

// Buscar transacciones por tipo
exports.buscarPorTipo = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({ tipo: req.params.tipo });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por tipo", error });
  }
};

// Buscar transacciones por cliente
exports.buscarPorCliente = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      cliente: req.params.clienteId,
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por cliente", error });
  }
};

// Buscar transacciones por empleado
exports.buscarPorEmpleado = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    let filtro = { empleado: req.params.empleadoId };

    if (mes && anio) {
      const mesFormateado = mes.padStart(2, "0"); // Asegurar que el mes tenga dos dígitos
      filtro.fecha = {
        $gte: new Date(`${anio}-${mesFormateado}-01T00:00:00.000Z`),
        $lte: new Date(`${anio}-${mesFormateado}-31T23:59:59.999Z`),
      };
    }

    console.log("Parámetros recibidos:", { mes, anio });
    console.log("Filtro generado:", filtro);

    const transacciones = await Transaccion.find(filtro);
    console.log("Transacciones encontradas:", transacciones);

    res.status(200).json(transacciones);
  } catch (error) {
    console.error("Error al buscar transacciones por empleado:", error);
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por empleado", error });
  }
};

// Buscar transacciones por trabajo
exports.buscarPorTrabajo = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      trabajo: req.params.trabajoId,
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar transacciones por trabajo", error });
  }
};

// Buscar transacciones por rango de fechas
exports.buscarPorRangoFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.params;
    const transacciones = await Transaccion.find({
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar transacciones por rango de fechas",
      error,
    });
  }
};

// Buscar transacciones por rango de montos
exports.buscarPorRangoMonto = async (req, res) => {
  try {
    const { montoMin, montoMax } = req.params;
    const transacciones = await Transaccion.find({
      monto: { $gte: parseFloat(montoMin), $lte: parseFloat(montoMax) },
    });
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar transacciones por rango de montos",
      error,
    });
  }
};

// Obtener balance general de transacciones
exports.obtenerBalanceGeneral = async (req, res) => {
  try {
    console.log("Iniciando obtención del balance general...");

    // Obtener todas las transacciones
    const transacciones = await Transaccion.find();
    console.log("Transacciones obtenidas:", transacciones);

    // Validar que todas las transacciones tengan un campo 'monto' válido
    const transaccionesValidas = transacciones.filter((transaccion) => {
      if (typeof transaccion.monto !== "number" || isNaN(transaccion.monto)) {
        console.error("Transacción inválida encontrada:", transaccion);
        return false;
      }
      return true;
    });

    // Calcular el balance general
    const balance = transaccionesValidas.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );

    console.log("Balance calculado:", balance);
    res.status(200).json({ balance });
  } catch (error) {
    console.error("Error al obtener el balance general:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el balance general", error });
  }
};

// Obtener balance por cliente
exports.obtenerBalancePorCliente = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      cliente: req.params.clienteId,
    });
    const balance = transacciones.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );
    res.status(200).json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener balance por cliente", error });
  }
};

// Obtener balance por empleado
exports.obtenerBalancePorEmpleado = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({
      empleado: req.params.empleadoId,
    });
    const balance = transacciones.reduce(
      (acc, transaccion) => acc + transaccion.monto,
      0
    );
    res.status(200).json({ balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener balance por empleado", error });
  }
};

// Obtener estadísticas generales de transacciones
exports.obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const totalTransacciones = await Transaccion.countDocuments();
    const transaccionesPorTipo = await Transaccion.aggregate([
      { $group: { _id: "$tipo", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ totalTransacciones, transaccionesPorTipo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas generales", error });
  }
};

// Obtener estadísticas por período
exports.obtenerEstadisticasPorPeriodo = async (req, res) => {
  try {
    const { periodo } = req.params;
    res.status(200).json({ message: "Estadísticas por período", periodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas por período", error });
  }
};

// Obtener transacciones pendientes de confirmación
exports.obtenerPendientes = async (req, res) => {
  try {
    const pendientes = await Transaccion.find({ estado: "pendiente" });
    res.status(200).json(pendientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones pendientes", error });
  }
};

// Confirmar transacción
exports.confirmar = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { estado: "confirmada" },
      { new: true }
    );
    res.status(200).json(transaccion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al confirmar la transacción", error });
  }
};

// Cancelar transacción
exports.cancelar = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { estado: "cancelada" },
      { new: true }
    );
    res.status(200).json(transaccion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cancelar la transacción", error });
  }
};

// Obtener resumen financiero
exports.obtenerResumenFinanciero = async (req, res) => {
  try {
    const totalCobros = await Transaccion.aggregate([
      { $match: { tipo: "cobro" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);
    const totalPagos = await Transaccion.aggregate([
      { $match: { tipo: "pago" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);
    res.status(200).json({
      totalCobros: totalCobros[0]?.total || 0,
      totalPagos: totalPagos[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el resumen financiero", error });
  }
};

// Obtener transacciones de cobros
exports.obtenerCobros = async (req, res) => {
  try {
    const cobros = await Transaccion.find({ tipo: "cobro" });
    res.status(200).json(cobros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones de cobros", error });
  }
};

// Obtener transacciones de pagos
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Transaccion.find({ tipo: "pago" });
    res.status(200).json(pagos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transacciones de pagos", error });
  }
};
