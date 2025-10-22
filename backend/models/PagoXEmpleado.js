const mongoose = require("mongoose");

const pagoXEmpleadoSchema = new mongoose.Schema(
  {
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },
    pago: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pago",
      required: true,
    },
    fechaAsignacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PagoXEmpleado", pagoXEmpleadoSchema);
