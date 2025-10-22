const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    cargo: {
      type: String,
      required: true,
    },
    departamento: {
      type: String,
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
    saldo: {
      type: Number,
      default: 0,
    },
    pagadoMes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Empleado", empleadoSchema);
