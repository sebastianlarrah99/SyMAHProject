import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function RegistroTrabajoModal({ onClose, onSuccess, trabajoAModificar }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    fechaInicio: "",
    cliente: "",
  });

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    if (trabajoAModificar) {
      setFormData({
        titulo: trabajoAModificar.titulo || "",
        descripcion: trabajoAModificar.descripcion || "",
        estado: trabajoAModificar.estado || "pendiente",
        fechaInicio: trabajoAModificar.fechaInicio
          ? new Date(trabajoAModificar.fechaInicio).toISOString().split("T")[0]
          : "",
        cliente: trabajoAModificar.cliente?._id || "",
      });
    }
  }, [trabajoAModificar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (trabajoAModificar) {
        // Actualizar trabajo existente
        await axios.put(
          `http://localhost:4000/api/trabajos/${trabajoAModificar._id}`,
          formData
        );
      } else {
        // Crear un nuevo trabajo
        await axios.post("http://localhost:4000/api/trabajos", formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar el trabajo:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>
          {trabajoAModificar ? "Modificar Trabajo" : "Registrar Nuevo Trabajo"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completado">Completado</option>
              <option value="activo">Activo</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha de Inicio</label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <select
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn confirm">
              {trabajoAModificar ? "Guardar Cambios" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default RegistroTrabajoModal;
