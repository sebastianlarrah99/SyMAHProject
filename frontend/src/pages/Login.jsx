import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "../App.css";
import "../styles/Login.css";
import Card from "../components/Card";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const getCsrfToken = async () => {
    const response = await axios.get("http://localhost:4000/auth/csrf-token", {
      withCredentials: true,
    });
    return response.data.csrfToken;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        { username, password },
        {
          headers: { "X-CSRF-Token": csrfToken },
          withCredentials: true,
        },
      );
      // Agregar registros de depuración para verificar la respuesta del backend
      console.log("Respuesta del servidor:", response.data);
      if (!response.data.token) {
        console.error("Token no recibido en la respuesta del servidor");
        alert(
          "Error: No se recibió un token de sesión. Por favor, intenta nuevamente.",
        );
        return;
      }
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/auth/register", {
        username: registerUsername,
        password: registerPassword,
        role: "user",
      });
      alert("Usuario registrado exitosamente");
      setActiveTab("login");
    } catch (error) {
      alert("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div
      className={`container ${activeTab === "login" ? "active-login" : "active-register"}`}
    >
      <Card>
        <div className="container box">
          <div>
            <img
              id="flyer"
              src="/Gemini_Generated_Image_mvfdpvmvfdpvmvfd-removebg-preview.png"
              alt="Logo Symah"
              style={{
                display: "block",
                margin: "20px auto",
                maxWidth: "100px",
              }}
            />
          </div>

          <div className="btn switch">
            {activeTab === "login" ? (
              <button
                type="button"
                className="btn arrow"
                onClick={() => setActiveTab("register")}
              >
                <FaArrowRight />
              </button>
            ) : (
              <button
                type="button"
                className="btn arrow"
                onClick={() => setActiveTab("login")}
              >
                <FaArrowLeft />
              </button>
            )}
          </div>
          <div className="switch login">
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
                  Iniciar Sesion
                </button>
              </form>
            </div>
            <div className="register">
              <form onSubmit={handleRegister}>
                <div>
                  <label>Usuario:</label>
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn login">
                  Registrar Usuario
                </button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
