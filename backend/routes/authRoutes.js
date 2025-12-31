const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Modelo de usuario
require("dotenv").config(); // Cargar variables de entorno
const rateLimit = require("express-rate-limit"); // Middleware para limitar la cantidad de solicitudes
const fastifyCsrf = require("@fastify/csrf");
const fastify = require("fastify")();

// Middleware para limitar la cantidad de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message:
    "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
});

// Configurar el plugin de CSRF
fastify.register(fastifyCsrf, { cookie: true });

// Aplicar el middleware de rate limiting a todas las rutas de autenticación
router.use(limiter);

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body; // Agregar el campo role

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    console.log("Contraseña antes del hasheo:", password);
    // Crear y guardar el nuevo usuario con la contraseña sin hashear
    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Intentando iniciar sesión con:", username);
    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    console.log("Usuario encontrado:", user);
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña en la base de datos:", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Resultado de bcrypt.compare:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT que incluya el rol del usuario
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      role: user.role, // Incluir el rol en la respuesta
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
});

// Middleware para proteger rutas
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret_key"
    );
    req.user = verified;
    next();
  } catch (error) {
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
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error al renovar el token", error });
  }
});

// Ruta para obtener el token CSRF
router.get("/csrf-token", (req, res) => {
  const csrfToken = fastify.csrfToken();
  res.status(200).json({ csrfToken });
});

module.exports = { router, authenticate, authorize };
