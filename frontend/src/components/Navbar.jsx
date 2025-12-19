import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBars } from "react-icons/fa"; // Icono de tres líneas

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/Gemini_Generated_Image_mvfdpvmvfdpvmvfd-removebg-preview.png" />
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <FaBars />
      </button>
      <ul className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
        <li className={location.pathname === "/app" ? "active" : ""}>
          <Link to="/app">Inicio</Link>
        </li>
        <li className={location.pathname === "/app/empleados" ? "active" : ""}>
          <Link to="/app/empleados">Empleados</Link>
        </li>
        <li className={location.pathname === "/app/trabajos" ? "active" : ""}>
          <Link to="/app/trabajos">Trabajos</Link>
        </li>
        <li className={location.pathname === "/app/clientes" ? "active" : ""}>
          <Link to="/app/clientes">Clientes</Link>
        </li>
        <li
          className={location.pathname === "/app/transacciones" ? "active" : ""}
        >
          <Link to="/app/transacciones">Transacciones</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
