// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1); // Detiene la aplicación si hay error
  }
};

module.exports = conectarDB;
