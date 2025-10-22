import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">SYMAH</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/empleados">Empleados</Link>
        </li>
        <li>
          <Link to="/trabajos">Trabajos</Link>
        </li>
        <li>
          <Link to="/clientes">Clientes</Link>
        </li>
        <li>
          <Link to="/transacciones">Transacciones</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
