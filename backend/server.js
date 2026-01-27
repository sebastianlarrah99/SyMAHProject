// server.js
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
require("dotenv").config();
const app = require("./index"); // Importar la configuración de Express

// Conectar a la Base de Datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json({ extended: true })); // Habilitar lectura de JSON

// Puerto de la App
const PORT = process.env.PORT || 4000;

// Rutas de la App
app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/trabajos", require("./routes/trabajoRoutes"));
app.use("/api/transacciones", require("./routes/transaccionRoutes"));
app.use("/api/registro-horas", require("./routes/registroHorasRoutes"));
app.use("/api/cargos", require("./routes/cargoRoutes"));
app.use("/auth", require("./routes/authRoutes"));

// Middleware para registrar todas las solicitudes entrantes
app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  next();
});

// Log para capturar errores globales
app.use((err, req, res, next) => {
  console.error("Error global capturado:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Arrancar el Servidor HTTP
app.listen(PORT, () => {
  console.log(`El servidor HTTP está funcionando en http://localhost:${PORT}`);
});

module.exports = { app };
