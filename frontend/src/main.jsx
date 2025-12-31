import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleProvider"; // Actualizar la ruta del proveedor

createRoot(document.getElementById("root")).render(
  <RoleProvider>
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </Router>
    </StrictMode>
  </RoleProvider>
);
