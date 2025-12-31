const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    cargo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cargo",
      required: true,
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
    pagado: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Empleado", empleadoSchema);
