import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function RegistroTransaccionModal({ onClose, onSuccess, transaccion }) {
  const [formData, setFormData] = useState({
    monto: transaccion?.monto || 0,
    fecha: "",
    actor: "",
    actorTipo: "",
    descripcion: transaccion?.descripcion || "",
  });
  const [actores, setActores] = useState({ empleados: [], trabajos: [] });

  useEffect(() => {
    const fetchActores = async () => {
      try {
        const empleadosResponse = await axios.get(
          "http://localhost:4000/api/empleados"
        );
        const trabajosResponse = await axios.get(
          "http://localhost:4000/api/trabajos"
        );
        setActores({
          empleados: empleadosResponse.data,
          trabajos: trabajosResponse.data,
        });
      } catch (error) {
        console.error("Error al obtener actores:", error);
      }
    };
    fetchActores();
  }, []);

  // Ajustar para filtrar actores según el tipo seleccionado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "actorTipo") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        actor: "", // Reiniciar el actor seleccionado
      }));
    }
  };

  // Ajustar para incluir el tipo de transacción basado en el tipo de actor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tipo = formData.actorTipo === "Empleado" ? "pago" : "cobro";
      const dataToSend = {
        monto: formData.monto,
        fecha: formData.fecha,
        actor: formData.actor,
        actorTipo: formData.actorTipo,
        tipo,
        descripcion: formData.descripcion,
      };
      const response = await axios.post(
        "http://localhost:4000/api/transacciones",
        dataToSend
      );
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error al registrar la transacción:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Registrar Nueva Transacción</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="monto">
              Monto
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="fecha">
              Fecha
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="actorTipo">
              Tipo de Actor
              <select
                id="actorTipo"
                name="actorTipo"
                value={formData.actorTipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Empleado">Empleado</option>
                <option value="Trabajo">Trabajo</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="actor">
              Actor
              <select
                id="actor"
                name="actor"
                value={formData.actor}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un actor</option>
                {formData.actorTipo === "Empleado" &&
                  actores.empleados.map((empleado) => (
                    <option key={empleado._id} value={empleado._id}>
                      {empleado.nombre}
                    </option>
                  ))}
                {formData.actorTipo === "Trabajo" &&
                  actores.trabajos.map((trabajo) => (
                    <option key={trabajo._id} value={trabajo._id}>
                      {trabajo.titulo}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn confirm">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default RegistroTransaccionModal;
