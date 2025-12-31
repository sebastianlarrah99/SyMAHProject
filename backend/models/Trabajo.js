const mongoose = require("mongoose");

const trabajoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en progreso", "completado", "activo"],
      default: "pendiente",
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
    },
    gastoManoObra: {
      type: Number,
      default: 0,
    },
    acumuladoPagos: {
      type: Number,
      default: 0,
    },
    ganancias: {
      type: Number,
      default: 0, // Se calculará en el controlador
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
