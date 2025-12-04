import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

function ModificarEmpleadoModal({ empleado, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: empleado.nombre || "",
    cargo: empleado.cargo || "Auxiliar",
    estado: empleado.estado || "Activo",
    saldo: empleado.saldo || 0,
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
    setFormData({ ...formData, [name]: value });

    if (name === "cargo") {
      const selectedCargo = cargos.find((cargo) => cargo.nombre === value);
      if (selectedCargo && value !== "Administrativo") {
        setFormData({
          ...formData,
          cargo: value,
          saldo: selectedCargo.pagoPorHora,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos antes de enviar
    if (!formData.nombre || !formData.cargo) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Convertir el nombre del cargo al ID correspondiente
    const cargoSeleccionado = cargos.find(
      (cargo) => cargo.nombre === formData.cargo
    );
    if (!cargoSeleccionado) {
      alert("El cargo seleccionado no es válido.");
      return;
    }

    const payload = {
      ...formData,
      cargo: cargoSeleccionado._id, // Enviar el ID del cargo
    };

    try {
      await axios.put(
        `http://localhost:4000/api/empleados/${empleado._id}`,
        payload
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al modificar el empleado:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Modificar Empleado</h3>
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
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn confirm">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModificarEmpleadoModal;
