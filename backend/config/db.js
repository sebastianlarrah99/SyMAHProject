// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false; // Variable para rastrear el estado de la conexión

const conectarDB = async () => {
  if (isConnected) {
    console.log("Ya existe una conexión activa a MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1); // Detiene la aplicación si hay error
  }
};

module.exports = conectarDB;
