const express = require("express");
const router = express.Router();

// Importar las rutas específicas
const clienteRoutes = require("./routes/clienteRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const trabajoRoutes = require("./routes/trabajoRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");

// Configurar las rutas base
router.use("/clientes", clienteRoutes);
router.use("/empleados", empleadoRoutes);
router.use("/trabajos", trabajoRoutes);
router.use("/transacciones", transaccionRoutes);

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    message: "API de Gestión - SYMAH2",
    version: "1.0.0",
    endpoints: {
      clientes: "/api/clientes",
      empleados: "/api/empleados",
      trabajos: "/api/trabajos",
      transacciones: "/api/transacciones",
    },
  });
});

module.exports = router;
