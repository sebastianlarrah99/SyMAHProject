const mongoose = require("mongoose");
const Transaccion = require("./Transaccion");

const pagoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
  },
});

module.exports = Transaccion.discriminator("Pago", pagoSchema);
