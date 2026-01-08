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

if (!mongoose.models.Gasto) {
  module.exports = mongoose.model("Gasto", gastoSchema);
} else {
  module.exports = mongoose.models.Gasto;
}
