const mongoose = require("mongoose");

const trabajosXClienteSchema = new mongoose.Schema(
  {
    trabajo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trabajo",
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrabajosXCliente", trabajosXClienteSchema);
