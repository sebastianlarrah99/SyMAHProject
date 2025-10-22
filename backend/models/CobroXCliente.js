const mongoose = require("mongoose");

const cobroXClienteSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    cobro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cobro",
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

module.exports = mongoose.model("CobroXCliente", cobroXClienteSchema);
