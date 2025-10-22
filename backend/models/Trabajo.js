const mongoose = require("mongoose");

const trabajoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en progreso", "completado"],
      default: "pendiente",
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
    },
    tipo: {
      type: String,
      required: true,
    },
    gastoManoObra: {
      type: Number,
      default: 0,
    },
    acumuladoPagos: {
      type: Number,
      default: 0,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trabajo", trabajoSchema);
