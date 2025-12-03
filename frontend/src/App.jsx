import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Empleado from "./pages/Empleado";
import Trabajo from "./pages/Trabajo";
import Cliente from "./pages/Cliente";
import Transaccion from "./pages/Transaccion";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Bienvenido a la aplicación</h1>
              <p>Selecciona una opción del menú para continuar</p>
            </>
          }
        />
        <Route path="/empleados" element={<Empleado />} />
        <Route path="/trabajos" element={<Trabajo />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/transacciones" element={<Transaccion />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route
          path="/cargos"
          element={<h1>Gestión de Cargos - Próximamente</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
