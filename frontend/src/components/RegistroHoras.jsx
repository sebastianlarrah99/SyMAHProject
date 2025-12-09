import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import EmployeeHoursModal from "./ListaRegistroHoras";

function RegisterHoursModal({ empleadoId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    trabajoNombre: "",
  });
  const [trabajos, setTrabajos] = useState([]);
  const [tarifa, setTarifa] = useState(0); // Nueva variable para la tarifa
  const [montoCalculado, setMontoCalculado] = useState(0);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/trabajos/estado/activos"
        );
        console.log("Trabajos activos obtenidos:", response.data);
        setTrabajos(response.data);
      } catch (error) {
        console.error("Error al obtener trabajos activos:", error);
      }
    };

    const fetchEmpleadoTarifa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/empleados/${empleadoId}`
        );
        console.log("Empleado obtenido:", response.data);

        if (response.data.cargo && response.data.cargo.pagoPorHora) {
          setTarifa(response.data.cargo.pagoPorHora); // Asignar la tarifa del cargo
        } else {
          console.warn(
            "El cargo o el campo pagoPorHora no están definidos en la respuesta."
          );
          setTarifa(0); // Asignar una tarifa predeterminada o 0
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error(
            "El empleado no tiene un cargo asignado o el cargo no existe."
          );
        } else {
          console.error("Error al obtener la tarifa del empleado:", error);
        }
        setTarifa(0); // Asignar una tarifa predeterminada o 0 en caso de error
      }
    };

    fetchActiveJobs();
    fetchEmpleadoTarifa();
  }, [empleadoId]);

  useEffect(() => {
    const { horaInicio, horaFin, fecha } = formData;
    console.log("Valores actuales para el cálculo:", {
      horaInicio,
      horaFin,
      fecha,
      tarifa,
    });

    if (!fecha) {
      console.warn("La fecha no está definida o es inválida.");
      setMontoCalculado(0);
      return;
    }

    if (!horaInicio || !horaFin) {
      console.warn("Hora de inicio o fin no están definidas.");
      setMontoCalculado(0);
      return;
    }

    const inicio = new Date(`${fecha}T${horaInicio}`);
    const fin = new Date(`${fecha}T${horaFin}`);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      console.warn("Los valores de horaInicio o horaFin no son válidos.");
      setMontoCalculado(0);
      return;
    }

    const horasTrabajadas = (fin - inicio) / (1000 * 60 * 60);
    console.log("Horas trabajadas calculadas:", horasTrabajadas);

    if (horasTrabajadas > 0) {
      setMontoCalculado(horasTrabajadas * tarifa); // Usar la tarifa obtenida
      console.log("Monto calculado:", horasTrabajadas * tarifa);
    } else {
      setMontoCalculado(0);
      console.warn("Horas trabajadas no válidas o negativas.");
    }
  }, [formData, tarifa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trabajoSeleccionado = trabajos.find(
        (trabajo) =>
          trabajo.titulo.trim().toLowerCase() ===
          formData.trabajoNombre.trim().toLowerCase()
      );
      if (!trabajoSeleccionado) {
        alert(
          "Por favor, selecciona un trabajo válido o verifica el nombre ingresado."
        );
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
      alert(
        "Hubo un error al registrar las horas. Por favor, inténtalo nuevamente."
      );
    }
  };

  const openHoursModal = () => {
    setIsHoursModalOpen(true);
  };

  const closeHoursModal = () => {
    setIsHoursModalOpen(false);
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h2>Registrar Horas</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Fecha
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Hora de Inicio
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleInputChange}
                required
              />
            </label>{" "}
          </div>
          <div className="form-group">
            <label>
              Hora de Fin
              <input
                type="time"
                name="horaFin"
                value={formData.horaFin}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Trabajo
              <select
                name="trabajoNombre"
                value={formData.trabajoNombre}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un trabajo</option>
                {trabajos.map((trabajo) => (
                  <option key={trabajo._id} value={trabajo.titulo}>
                    {trabajo.titulo}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>Tarifa por Hora: ${tarifa.toFixed(2)}</p>
          <p>Monto Calculado: ${montoCalculado.toFixed(2)}</p>
          <button type="submit">Registrar</button>
          <button type="button" onClick={openHoursModal}>
            Consultar Horarios
          </button>
        </form>
      </div>
      {isHoursModalOpen && (
        <EmployeeHoursModal empleadoId={empleadoId} onClose={closeHoursModal} />
      )}
    </Modal>
  );
}

export default RegisterHoursModal;
