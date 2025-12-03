const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const clienteRoutes = require("./routes/clienteRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const trabajoRoutes = require("./routes/trabajoRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");
const cargoRoutes = require("./routes/cargoRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

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
    },
  });
});

// Conexión a la base de datos
mongoose
  .connect("mongodb://localhost:27017/symah", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión a la base de datos exitosa"))
  .catch((error) =>
    console.error("Error al conectar a la base de datos:", error)
  );

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
