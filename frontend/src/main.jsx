import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleProvider"; // Actualizar la ruta del proveedor
import BasicBarChart from "./test/BasicBarChart";
import { io } from "socket.io-client";

const container = document.getElementById("root");
let root = container._reactRootContainer || null;

if (!root) {
  root = createRoot(container);
  container._reactRootContainer = root;
}

const socket = io(); // Conectar al servidor de WebSocket

socket.on("nuevaTransaccion", (transaccion) => {
  console.log("Nueva transacción registrada:", transaccion);
  // Aquí puedes agregar lógica para actualizar el estado o volver a cargar los datos
});

root.render(
  <RoleProvider>
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app/*" element={<App />} />
          <Route path="/test-bar-chart" element={<BasicBarChart />} />
        </Routes>
      </Router>
    </StrictMode>
  </RoleProvider>
);
