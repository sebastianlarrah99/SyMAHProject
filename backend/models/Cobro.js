const mongoose = require("mongoose");
const Transaccion = require("./Transaccion");

const cobroSchema = new mongoose.Schema({
  descripcion: {
    type: String,
  },
});

module.exports = Transaccion.discriminator("Cobro", cobroSchema);
