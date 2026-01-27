const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Modelo de usuario
const { registerUser, loginUser } = require("../controllers/userController");
require("dotenv").config(); // Cargar variables de entorno
const rateLimit = require("express-rate-limit"); // Middleware para limitar la cantidad de solicitudes
const csrf = require("csurf");

// Middleware para limitar la cantidad de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message:
    "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
});

// Configurar el middleware de CSRF
const csrfProtection = csrf({ cookie: true });

// Aplicar el middleware de rate limiting a todas las rutas de autenticación
router.use(limiter);
router.use(csrfProtection);

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Middleware para proteger rutas
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Encabezado de autorización recibido:", authHeader); // Registro de depuración

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Token no proporcionado o formato incorrecto"); // Registro de depuración
    return res.status(401).json({ message: "Acceso denegado" });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token después de Bearer

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret_key",
    );
    req.user = verified;
    next();
  } catch (error) {
    console.log("Error al verificar el token:", error.message); // Registro de depuración
    res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar roles y permisos
const authorize = (roles) => (req, res, next) => {
  const userRole = req.user.role; // El rol del usuario autenticado

  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  next();
};

// Ejemplo de uso en una ruta protegida
router.get("/admin-only", authenticate, authorize(["admin"]), (req, res) => {
  res.status(200).json({ message: "Bienvenido, administrador" });
});

// Middleware para renovar tokens JWT
router.post("/refresh-token", authenticate, (req, res) => {
  try {
    const newToken = jwt.sign(
      { id: req.user.id, username: req.user.username },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" },
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error al renovar el token", error });
  }
});

// Ruta para obtener el token CSRF
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Ruta para cerrar sesión
router.post("/logout", authenticate, (req, res) => {
  try {
    // Invalidar el token en el cliente
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cerrar sesión", error });
  }
});

// Middleware para manejar errores de CSRF
router.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Token CSRF inválido o faltante" });
  }
  next(err);
});

// Middleware para depurar el flujo de CSRF
router.use((req, res, next) => {
  console.log(
    "Token CSRF generado:",
    req.csrfToken ? req.csrfToken() : "No generado",
  );
  console.log("Encabezado X-CSRF-Token recibido:", req.headers["x-csrf-token"]);
  console.log("Cookies recibidas:", req.cookies);
  next();
});

// Exportar el router correctamente
module.exports = router;
