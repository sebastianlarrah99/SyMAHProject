import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function RegistroClienteModal({ cliente, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        direccion: cliente.direccion || "",
        telefono: cliente.telefono || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (cliente) {
        // Actualizar cliente existente
        response = await axios.put(
          `http://localhost:4000/api/clientes/${cliente._id}`,
          formData
        );
      } else {
        // Crear nuevo cliente
        response = await axios.post(
          "http://localhost:4000/api/clientes",
          formData
        );
      }
      onSuccess(response.data); // Usar la respuesta del backend
      onClose();
    } catch (error) {
      console.error("Error al registrar o modificar el cliente:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>{cliente ? "Modificar Cliente" : "Registrar Nuevo Cliente"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="direccion">
              Dirección
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="telefono">
              Teléfono
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn submit">
              {cliente ? "Guardar Cambios" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default RegistroClienteModal;
