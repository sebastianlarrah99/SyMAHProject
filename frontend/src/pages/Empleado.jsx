import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Card from "../components/Card";
import RegisterHoursModal from "../components/RegistroHoras";
import EmployeeHoursModal from "../components/ListaRegistroHoras";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroEmpleadoModal from "../components/RegistroEmpleadoModal";
import ModificarEmpleadoModal from "../components/ModificarEmpleadoModal";
import TransaccionesTrabajoModal from "../components/TransaccionesTrabajoModal";
import {
  FaEye,
  FaEdit,
  FaClock,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaList,
} from "react-icons/fa";
import "../styles/ToggleSwitch.css"; // Importar estilos para el switch
import DataTable from "../components/DataTable";
import ConfigModal from "../components/ConfigModal";

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [detalleData, setDetalleData] = useState(null);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [isModificarModalOpen, setIsModificarModalOpen] = useState(false);
  const [empleadoAModificar, setEmpleadoAModificar] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("activo"); // Estado por defecto
  const [empleadoTransacciones, setEmpleadoTransacciones] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const fetchEmpleados = useCallback(async () => {
    try {
      const url = estadoFiltro
        ? `http://localhost:4000/api/empleados?estado=${estadoFiltro}`
        : `http://localhost:4000/api/empleados`;
      console.log("URL generada para la solicitud:", url); // Depuración
      const response = await axios.get(url);
      console.log("Datos recibidos del backend:", response.data); // Depuración

      // Filtrar empleados según el estado seleccionado (solución temporal)
      const empleadosFiltrados = response.data.filter(
        (empleado) => !estadoFiltro || empleado.estado === estadoFiltro
      );
      setEmpleados(empleadosFiltrados);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  }, [estadoFiltro]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const confirmarEliminacion = async () => {
    if (empleadoAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/empleados/${empleadoAEliminar}`
        );
        setEmpleados(
          empleados.filter((empleado) => empleado._id !== empleadoAEliminar)
        );
        setEmpleadoAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
      }
    }
  };

  const toggleEstadoEmpleado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
      await axios.put(`http://localhost:4000/api/empleados/inactivar/${id}`, {
        estado: nuevoEstado,
      });

      // Actualizar el estado localmente para reflejar el cambio inmediatamente
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado._id === id ? { ...empleado, estado: nuevoEstado } : empleado
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del empleado:", error);
    }
  };

  const openModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(false);
  };

  const closeHoursModal = () => {
    setSelectedEmpleado(null);
    setIsHoursModalOpen(false);
    fetchEmpleados(); // Refrescar la lista de empleados para actualizar el saldo
  };

  const closeDetalle = () => {
    setDetalleData(null);
    setIsDetalleOpen(false);
  };

  const handleSuccess = () => {
    // Refrescar la lista de empleados después de registrar horas
    fetchEmpleados();
  };

  const openDetalle = (empleado) => {
    setDetalleData(empleado);
    setIsDetalleOpen(true);
  };

  const openRegistroModal = () => {
    setIsRegistroModalOpen(true);
  };

  const closeRegistroModal = () => {
    setIsRegistroModalOpen(false);
  };

  const openConfigModal = () => {
    setIsConfigModalOpen(true);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
  };

  const openModificarModal = (empleado) => {
    setEmpleadoAModificar(empleado);
    setIsModificarModalOpen(true);
  };

  const closeModificarModal = () => {
    setEmpleadoAModificar(null);
    setIsModificarModalOpen(false);
  };

  const openTransaccionesModal = (empleadoId) => {
    setEmpleadoTransacciones(empleadoId);
  };

  const closeTransaccionesModal = () => {
    setEmpleadoTransacciones(null);
  };

  const handleFilterChange = (e) => {
    setEstadoFiltro(e.target.value);
  };

  const headers = ["Nombre", "Cargo", "Estado", "Acciones"];
  const data = empleados.map((empleado) => [
    empleado.nombre,
    empleado.cargo?.nombre || "Sin cargo",
    empleado.estado,
    <div className="action-buttons">
      <button
        className="btn view"
        title="Detalle"
        onClick={() => openDetalle(empleado)}
      >
        <FaEye />
      </button>
      <button
        className="btn edit"
        title="Modificar"
        onClick={() => openModificarModal(empleado)}
      >
        <FaEdit />
      </button>
      <button
        className="btn hours"
        title="Registrar Horas"
        onClick={() => openModal(empleado)}
      >
        <FaClock />
      </button>
      <button
        className="btn list"
        title="Ver Transacciones"
        onClick={() => openTransaccionesModal(empleado._id)}
      >
        <FaList />
      </button>
      <button
        className="btn delete"
        title="Eliminar"
        onClick={() => setEmpleadoAEliminar(empleado._id)}
      >
        <FaTrash />
      </button>
      <button
        className="btn toggle"
        title="Cambiar Estado"
        onClick={() => toggleEstadoEmpleado(empleado._id, empleado.estado)}
      >
        {empleado.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </div>,
  ]);

  return (
    <div style={{ position: "relative" }}>
      <Card
        title="Gestión de Empleados"
        description="Administra la información de los empleados, incluyendo sus datos personales y horarios."
      >
        <DataTable headers={headers} data={data} />
        <div className="filter-container">
          <label htmlFor="estadoFiltro">
            {" "}
            <select
              id="estadoFiltro"
              value={estadoFiltro}
              onChange={handleFilterChange}
            >
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="">Todos</option>
            </select>
          </label>
        </div>
      </Card>
      <button
        className="btn register"
        onClick={openRegistroModal}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        +
      </button>
      <button
        className="btn register"
        onClick={openConfigModal}
        style={{ position: "fixed", bottom: "20px", right: "80px" }}
      >
        -
      </button>
      {isModalOpen && selectedEmpleado && (
        <RegisterHoursModal
          empleadoId={selectedEmpleado._id}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {isHoursModalOpen && selectedEmpleado && (
        <EmployeeHoursModal
          empleadoId={selectedEmpleado._id}
          onClose={closeHoursModal}
        />
      )}
      {isDetalleOpen && detalleData && (
        <Detalle data={detalleData} onClose={closeDetalle} />
      )}
      {empleadoAEliminar && (
        <Modal onClose={() => setEmpleadoAEliminar(null)}>
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este empleado?</p>
            <div className="modal-actions">
              <button
                className="btn cancel"
                onClick={() => setEmpleadoAEliminar(null)}
              >
                Cancelar
              </button>
              <button className="btn confirm" onClick={confirmarEliminacion}>
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isRegistroModalOpen && (
        <RegistroEmpleadoModal
          onClose={closeRegistroModal}
          onSuccess={handleSuccess}
        />
      )}
      {isConfigModalOpen && (
        <ConfigModal onClose={closeConfigModal}>
          onClose={closeConfigModal}
          onSuccess={handleSuccess}
        </ConfigModal>
      )}
      {isModificarModalOpen && empleadoAModificar && (
        <ModificarEmpleadoModal
          empleado={empleadoAModificar}
          onClose={closeModificarModal}
          onSuccess={handleSuccess}
        />
      )}
      {empleadoTransacciones && (
        <TransaccionesTrabajoModal
          trabajoId={empleadoTransacciones}
          onClose={closeTransaccionesModal}
        />
      )}
    </div>
  );
};

export default Empleado;
