// server.js
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
require("dotenv").config();

// Inicializar la App
const app = express();

// Conectar a la Base de Datos
conectarDB();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend (React)
app.use(express.json({ extended: true })); // Habilitar lectura de JSON

// Puerto de la App
const PORT = process.env.PORT || 4000;

// Rutas de la App
app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/trabajos", require("./routes/trabajoRoutes"));
app.use("/api/transacciones", require("./routes/transaccionRoutes"));
app.use("/api/registro-horas", require("./routes/registroHorasRoutes"));

// Arrancar el Servidor
app.listen(PORT, () => {
  console.log(`El servidor está funcionando en http://localhost:${PORT}`);
});

module.exports = app;
