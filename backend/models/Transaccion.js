const mongoose = require("mongoose");

const transaccionBaseOptions = {
  discriminatorKey: "tipo",
  collection: "transacciones",
};

const transaccionSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "actorTipo",
    },
    actorTipo: {
      type: String,
      required: true,
      enum: ["Empleado", "Trabajo"],
    },
  },
  transaccionBaseOptions
);

module.exports = mongoose.model("Transaccion", transaccionSchema);
