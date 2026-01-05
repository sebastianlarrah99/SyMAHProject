// server.js
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

// Deshabilitar la verificación de certificados en desarrollo
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Inicializar la App
const app = express();

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
app.use("/auth", require("./routes/authRoutes").router);

// Cargar certificados SSL
const sslOptions = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
};

// Log para verificar el inicio del servidor HTTPS
console.log("Intentando iniciar el servidor HTTPS en el puerto", PORT);

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

// Arrancar el Servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(
    `El servidor HTTPS está funcionando en https://localhost:${PORT}`
  );
});

// Arrancar el Servidor HTTP
app.listen(4001, () => {
  console.log("El servidor HTTP está funcionando en http://localhost:4001");
});

module.exports = app;
require("dotenv").config();
conectarDB();

app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/trabajos", require("./routes/trabajoRoutes"));
app.use("/api/transacciones", require("./routes/transaccionRoutes"));
app.use("/api/registro-horas", require("./routes/registroHorasRoutes"));
app.use("/api/cargos", require("./routes/cargoRoutes"));
app.use("/auth", require("./routes/authRoutes").router);
