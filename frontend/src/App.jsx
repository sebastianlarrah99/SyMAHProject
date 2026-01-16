import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
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
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "https://localhost:5173/";
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
      </Routes>
    </>
  );
}

export default App;
