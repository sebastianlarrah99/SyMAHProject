import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function RegistroEmpleadoModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    cargo: "Auxiliar",
    saldo: 0,
    estado: "Activo",
  });
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/cargos");
        setCargos(response.data);
      } catch (error) {
        console.error("Error al obtener los cargos:", error);
      }
    };

    fetchCargos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      if (name === "cargo") {
        const selectedCargo = cargos.find((cargo) => cargo.nombre === value);
        if (selectedCargo) {
          updatedFormData.saldo = selectedCargo.pagoPorHora;
        }
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos antes de enviarlos
    if (!formData.nombre || !formData.cargo) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    // Convertir el estado a minúsculas antes de enviarlo
    const dataToSend = { ...formData, estado: formData.estado.toLowerCase() };

    console.log("Datos enviados al backend:", dataToSend); // Log para verificar los datos enviados

    try {
      // Enviar los datos correctamente al backend
      await axios.post("http://localhost:4000/api/empleados", dataToSend);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar el empleado:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Registrar Nuevo Empleado</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <select
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              required
            >
              {cargos.map((cargo) => (
                <option key={cargo._id} value={cargo.nombre}>
                  {cargo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="saldo">Saldo</label>
            <input
              type="number"
              id="saldo"
              name="saldo"
              value={formData.saldo}
              onChange={handleChange}
              disabled
            />
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

export default RegistroEmpleadoModal;
