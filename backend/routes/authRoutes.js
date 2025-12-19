const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Modelo de usuario

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario
    const newUser = new User({ username, password: hashedPassword });
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
    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña en la base de datos:", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
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
    const verified = jwt.verify(token, "secret_key");
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = { router, authenticate };
