const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  pagoPorHora: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Cargo", cargoSchema);
