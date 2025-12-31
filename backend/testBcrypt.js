const bcrypt = require("bcryptjs"); // Cambiado a bcryptjs para pruebas

const password = "user123";
const hash = "$2b$10$96T5OZ7HK/t85h3DDSJKaOZI1ZnfZqE7pL0a2c.ddSQ/INvPSVQ.G";

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error("Error durante la comparación:", err);
  } else {
    console.log("¿Las contraseñas coinciden?", result);
  }
});
