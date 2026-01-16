const mongoose = require("mongoose");

const PresupuestoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  direccion: { type: String, required: true },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  items: [
    {
      item: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Presupuesto", PresupuestoSchema);
