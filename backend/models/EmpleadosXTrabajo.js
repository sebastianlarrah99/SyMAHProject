const mongoose = require("mongoose");

const empleadosXTrabajoSchema = new mongoose.Schema(
  {
    trabajo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trabajo",
      required: true,
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmpleadosXTrabajo", empleadosXTrabajoSchema);
