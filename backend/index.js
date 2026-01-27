const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const clienteRoutes = require("./routes/clienteRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const trabajoRoutes = require("./routes/trabajoRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");
const cargoRoutes = require("./routes/cargoRoutes");
const presupuestoRoutes = require("./routes/presupuestoRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Cambiado al dominio correcto del frontend
    credentials: true, // Permitir cookies
  }),
);
app.use(express.json());
app.use(cookieParser());

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/trabajos", trabajoRoutes);
app.use("/api/transacciones", transaccionRoutes);
app.use("/api/cargos", cargoRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Gestión - SYMAH2",
    version: "1.0.0",
    endpoints: {
      clientes: "/api/clientes",
      empleados: "/api/empleados",
      trabajos: "/api/trabajos",
      transacciones: "/api/transacciones",
      cargos: "/api/cargos",
      presupuestos: "/api/presupuestos",
      auth: "/auth",
    },
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
