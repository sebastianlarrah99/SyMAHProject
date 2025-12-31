import React, { useState } from "react";
import "../styles/Registro.css";

const Registro = ({ titulo, campos, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="registro-container">
      <h2>{titulo}</h2>
      <form onSubmit={handleSubmit}>
        {campos.map((campo) => (
          <div key={campo.nombre} className="form-group">
            <label htmlFor={campo.nombre}>{campo.etiqueta}</label>
            <input
              type={campo.tipo || "text"}
              id={campo.nombre}
              name={campo.nombre}
              value={formData[campo.nombre] || ""}
              onChange={handleChange}
              placeholder={campo.placeholder || ""}
              required={campo.requerido || false}
            />
          </div>
        ))}
        <button type="submit" className="btn-submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Registro;
