import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Card from "../components/Card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4001/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      // Guardar el rol del usuario y forzar la actualización del contexto
      const event = new Event("storage");
      localStorage.setItem("role", response.data.role);
      window.dispatchEvent(event);
      console.log("Rol recibido del servidor:", response.data.role); // Verificar el valor del rol
      alert("Inicio de sesión exitoso como " + response.data.role);
      navigate("/app"); // Redirigir al componente App después del inicio de sesión exitoso
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <>
      <Card>
        <div>
          <img
            id="flyer"
            src="/Gemini_Generated_Image_mvfdpvmvfdpvmvfd-removebg-preview.png"
            alt="Logo Symah"
            style={{ display: "block", margin: "20px auto", maxWidth: "100px" }}
          />
        </div>
        <div className="login">
          <form onSubmit={handleLogin}>
            <div>
              <label>Usuario:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn login">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </Card>
    </>
  );
};

export default Login;
