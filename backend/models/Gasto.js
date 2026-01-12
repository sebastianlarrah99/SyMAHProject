const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.Gasto || mongoose.model("Gasto", gastoSchema);
