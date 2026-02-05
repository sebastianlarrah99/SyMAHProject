import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

import "./App.css";
import Navbar from "./components/Navbar";
import Empleado from "./pages/Empleado";
import Trabajo from "./pages/Trabajo";
import Cliente from "./pages/Cliente";
import Transaccion from "./pages/Transaccion";
import Estadisticas from "./pages/Estadisticas";
import Card from "./components/Card";
import Presupuestos from "./pages/Presupuesto";
import Auth from "./pages/Auth";

function App() {
  const navigate = useNavigate();

  // Agregar función para obtener el token CSRF
  const getCsrfToken = async () => {
    const response = await fetch("http://localhost:4000/auth/csrf-token", {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Bienvenido a SYMAH</h1>
              <img
                id="flyer"
                src="/Gemini_Generated_Image_mvfdpvmvfdpvmvfd-removebg-preview.png"
              />
              <button
                className="btn logout"
                onClick={async () => {
                  try {
                    // Verificar si el token existe antes de enviarlo
                    const token = localStorage.getItem("token");
                    if (!token) {
                      console.error("Token no encontrado en localStorage");
                      alert("Sesion cerrada. Por favor, inicia sesion.");
                      navigate("/auth");
                      return;
                    }

                    const csrfToken = await getCsrfToken(); // Obtener el token CSRF
                    // Corregir el formato del encabezado Authorization
                    await fetch("http://localhost:4000/auth/logout", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`, // Usar el formato Bearer <token>
                        "X-CSRF-Token": csrfToken, // Incluir el token CSRF
                      },
                      credentials: "include",
                    });
                    localStorage.clear();
                    // Agregar registro de depuración para verificar la redirección
                    console.log(
                      "Redirigiendo a /auth después de cerrar sesión",
                    );
                    navigate("/auth"); // Redirigir a la página principal
                  } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                  }
                }}
              >
                <FaPowerOff />
              </button>
            </>
          }
        />
        <Route path="empleados" element={<Empleado />} />
        <Route path="trabajos" element={<Trabajo />} />
        <Route path="clientes" element={<Cliente />} />
        <Route path="transacciones" element={<Transaccion />} />
        <Route path="estadisticas" element={<Estadisticas />} />
        <Route path="presupuestos" element={<Presupuestos />} />
        <Route
          path="app/cargos"
          element={<h1>Gestión de Cargos - Próximamente</h1>}
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
