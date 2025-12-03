import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import Card from "./Card";
import DataTable from "./DataTable";
import { FaTrash } from "react-icons/fa";

function EmployeeHoursModal({ empleadoId, onClose }) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(new Date().getMonth() + 1); // Mes actual
  const [anio, setAnio] = useState(new Date().getFullYear()); // Año actual
  const [saldoActual, setSaldoActual] = useState(0);
  const [totalCobrado, setTotalCobrado] = useState(0);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Obtener horarios registrados del empleado
        const response = await axios.get(
          `http://localhost:4000/api/registro-horas/empleado/${empleadoId}`
        );
        const registros = response.data;

        // Filtrar por mes y año
        const registrosFiltrados = registros.filter((registro) => {
          const fecha = new Date(registro.horaIngreso);
          return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
        });

        setHorarios(registrosFiltrados);

        // Obtener saldo actual del empleado
        const empleadoResponse = await axios.get(
          `http://localhost:4000/api/empleados/${empleadoId}`
        );
        setSaldoActual(empleadoResponse.data.saldo);

        // Obtener total cobrado en el mes (transacciones de pago)
        const pagosResponse = await axios.get(
          `http://localhost:4000/api/transacciones/buscar/por-empleado/${empleadoId}?mes=${mes}&anio=${anio}`
        );
        const totalPagos = pagosResponse.data.reduce(
          (acc, transaccion) => acc + transaccion.monto,
          0
        );
        setTotalCobrado(totalPagos);
      } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [empleadoId, mes, anio]);

  const handleDelete = async (id) => {
    try {
      // Eliminar el registro de horas
      await axios.delete(`http://localhost:4000/api/registro-horas/${id}`);

      // Actualizar la lista de horarios después de eliminar
      setHorarios((prevHorarios) =>
        prevHorarios.filter((horario) => horario._id !== id)
      );

      // Actualizar el saldo actual y el total cobrado
      const empleadoResponse = await axios.get(
        `http://localhost:4000/api/empleados/${empleadoId}`
      );
      setSaldoActual(empleadoResponse.data.saldo);

      const pagosResponse = await axios.get(
        `http://localhost:4000/api/transacciones/buscar/por-empleado/${empleadoId}?mes=${mes}&anio=${anio}`
      );
      const totalPagos = pagosResponse.data.reduce(
        (acc, transaccion) => acc + transaccion.monto,
        0
      );
      setTotalCobrado(totalPagos);

      alert("Registro eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el registro de horas:", error);
      alert(
        "Hubo un error al eliminar el registro. Por favor, inténtalo nuevamente."
      );
    }
  };

  const headers = [
    "Trabajo",
    "Fecha",
    "Hora de Ingreso",
    "Hora de Salida",
    "Monto Calculado",
    "Acciones",
  ];
  const data = horarios.map((horario) => [
    horario.trabajo?.titulo || "Sin título",
    new Date(horario.horaIngreso).toLocaleDateString(),
    new Date(horario.horaIngreso).toLocaleTimeString(),
    new Date(horario.horaSalida).toLocaleTimeString(),
    `$${horario.montoCalculado.toFixed(2)}`,
    <div className="action-buttons">
      <button
        className="btn btn-danger delete"
        title="Eliminar"
        id="delete-button"
        onClick={() => handleDelete(horario._id)}
      >
        <FaTrash />
      </button>
    </div>,
  ]);

  return (
    <Modal
      onClose={onClose}
      title="Horarios Registrados"
      description="Consulta los horarios registrados del empleado para el mes y año seleccionados."
    >
      {loading ? (
        <p>Cargando...</p>
      ) : horarios.length > 0 ? (
        <DataTable headers={headers} data={data} />
      ) : (
        <div className="no-horarios-registrados">
          <p>No se encontraron horarios registrados para este trabajo.</p>
        </div>
      )}
      <div className="filter-group">
        <label>
          Mes:
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("es", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
        <label>
          Año:
          <select
            value={anio}
            onChange={(e) => setAnio(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 21 }, (_, i) => (
              <option key={i + 2024} value={i + 2024}>
                {i + 2024}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="cuenta-horario">
        <p>Saldo Actual: ${saldoActual.toFixed(2)}</p>
        <p>Total Cobrado en el Mes: ${totalCobrado.toFixed(2)}</p>
      </div>
    </Modal>
  );
}

export default EmployeeHoursModal;
