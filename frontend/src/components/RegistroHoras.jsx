import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import "../styles/RegistroHoras.css";

function RegisterHoursModal({ empleadoId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    trabajoNombre: "",
  });
  const [trabajos, setTrabajos] = useState([]);
  const [montoCalculado, setMontoCalculado] = useState(0);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/trabajos/activos"
        );
        setTrabajos(response.data);
      } catch (error) {
        console.error("Error al obtener trabajos activos:", error);
      }
    };

    fetchActiveJobs();
  }, []);

  useEffect(() => {
    const { horaInicio, horaFin } = formData;
    if (horaInicio && horaFin) {
      const inicio = new Date(`${formData.fecha}T${horaInicio}`);
      const fin = new Date(`${formData.fecha}T${horaFin}`);
      const horasTrabajadas = (fin - inicio) / (1000 * 60 * 60);
      if (horasTrabajadas > 0) {
        const tarifa = 30; // Ejemplo: tarifa fija por hora
        setMontoCalculado(horasTrabajadas * tarifa);
      } else {
        setMontoCalculado(0);
      }
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trabajoSeleccionado = trabajos.find(
        (trabajo) => trabajo.titulo === formData.trabajoNombre
      );
      if (!trabajoSeleccionado) {
        alert("Por favor, selecciona un trabajo válido.");
        return;
      }

      const payload = {
        empleadoId,
        trabajoId: trabajoSeleccionado._id,
        horaIngreso: `${formData.fecha}T${formData.horaInicio}`,
        horaSalida: `${formData.fecha}T${formData.horaFin}`,
      };

      await axios.post("http://localhost:4000/api/registro-horas", payload);
      alert("Horas registradas correctamente.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar horas:", error);
      alert("Hubo un error al registrar las horas.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="register-hours-modal">
        <h2>Registrar Horas</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Fecha:
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Hora de Inicio:
            <input
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Hora de Fin:
            <input
              type="time"
              name="horaFin"
              value={formData.horaFin}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Trabajo:
            <input
              type="text"
              name="trabajoNombre"
              value={formData.trabajoNombre}
              onChange={handleInputChange}
              required
            />
          </label>
          <ul>
            {trabajos.map((trabajo) => (
              <li key={trabajo._id}>{trabajo.titulo}</li>
            ))}
          </ul>
          <p>Monto Calculado: ${montoCalculado.toFixed(2)}</p>
          <button type="submit">Registrar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default RegisterHoursModal;
