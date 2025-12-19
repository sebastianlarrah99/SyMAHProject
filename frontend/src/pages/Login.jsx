import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      alert("Inicio de sesión exitoso");
      navigate("/app"); // Redirigir al componente App después del inicio de sesión exitoso
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <Modal>
      <div>
        <h2>Iniciar Sesión</h2>
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
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </Modal>
  );
};

export default Login;
