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
      <div className="navbar-logo">SYMAH</div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <FaBars />
      </button>
      <ul className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Inicio</Link>
        </li>
        <li className={location.pathname === "/empleados" ? "active" : ""}>
          <Link to="/empleados">Empleados</Link>
        </li>
        <li className={location.pathname === "/trabajos" ? "active" : ""}>
          <Link to="/trabajos">Trabajos</Link>
        </li>
        <li className={location.pathname === "/clientes" ? "active" : ""}>
          <Link to="/clientes">Clientes</Link>
        </li>
        <li className={location.pathname === "/transacciones" ? "active" : ""}>
          <Link to="/transacciones">Transacciones</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
