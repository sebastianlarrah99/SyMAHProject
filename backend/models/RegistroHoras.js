const mongoose = require("mongoose");

const registroHorasSchema = new mongoose.Schema(
  {
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },
    trabajo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trabajo",
      required: true,
    },
    horaIngreso: {
      type: Date,
      required: true,
    },
    horaSalida: {
      type: Date,
      required: true,
    },
    montoCalculado: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RegistroHoras", registroHorasSchema);
