import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroTrabajoModal from "../components/RegistroTrabajoModal";
import TransaccionesTrabajoModal from "../components/TransaccionesTrabajoModal";
import { FaEye, FaEdit, FaClock, FaTrash, FaList } from "react-icons/fa";

function Trabajo() {
  const [trabajos, setTrabajos] = useState([]);
  const [detalleTrabajo, setDetalleTrabajo] = useState(null);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [trabajoAModificar, setTrabajoAModificar] = useState(null);
  const [trabajoTransacciones, setTrabajoTransacciones] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("activo"); // Estado por defecto

  const fetchTrabajos = async () => {
    try {
      const url = estadoFiltro
        ? `http://localhost:4000/api/trabajos?estado=${estadoFiltro}`
        : `http://localhost:4000/api/trabajos`;
      const response = await axios.get(url);
      setTrabajos(response.data || []);
    } catch (error) {
      console.error("Error al obtener los trabajos:", error);
      setTrabajos([]); // Asegurarse de que trabajos sea un array vacío en caso de error
    }
  };

  useEffect(() => {
    fetchTrabajos();
  }, [estadoFiltro]);

  const confirmarEliminacion = async () => {
    if (trabajoAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/trabajos/${trabajoAEliminar}`
        );
        setTrabajos(
          trabajos.filter((trabajo) => trabajo._id !== trabajoAEliminar)
        );
        setTrabajoAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar el trabajo:", error);
      }
    }
  };

  const openRegistroModal = () => {
    setIsRegistroModalOpen(true);
  };

  const openModificarModal = (trabajo) => {
    setTrabajoAModificar(trabajo);
    setIsRegistroModalOpen(true);
  };

  const openTransaccionesModal = (trabajoId) => {
    setTrabajoTransacciones(trabajoId);
  };

  const closeRegistroModal = () => {
    setIsRegistroModalOpen(false);
    setTrabajoAModificar(null);
  };

  const closeTransaccionesModal = () => {
    setTrabajoTransacciones(null);
  };

  const handleSuccess = () => {
    fetchTrabajos(); // Actualizar la tabla automáticamente al registrar o modificar un trabajo
    closeRegistroModal();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const estadosTrabajo = ["pendiente", "en progreso", "completado", "activo"]; // Estados definidos en el modelo
  const headers = [
    "Trabajo",
    "Estado",
    "Fecha Inicio",
    "Fecha Fin",
    "Gasto Mano de Obra",
    "Pago",
    "Ganancias", // Nuevo encabezado para ganancias
    "Acciones",
  ];
  const data = trabajos
    .filter((trabajo) => trabajo && trabajo.titulo) // Validar que el trabajo y su título existan
    .map((trabajo) => [
      trabajo.titulo,
      trabajo.estado,
      new Date(trabajo.fechaInicio).toLocaleDateString(),
      trabajo.fechaFin
        ? new Date(trabajo.fechaFin).toLocaleDateString()
        : "Pendiente",
      formatCurrency(trabajo.gastoManoObra),
      formatCurrency(trabajo.acumuladoPagos || 0),
      formatCurrency(trabajo.ganancias || 0), // Mostrar ganancias
      <div className="action-buttons">
        <button
          className="btn view"
          title="Ver más"
          onClick={() => setDetalleTrabajo(trabajo)}
        >
          <FaEye />
        </button>
        <button
          className="btn edit"
          title="Modificar"
          onClick={() => openModificarModal(trabajo)}
        >
          <FaEdit />
        </button>
        <button
          className="btn list"
          title="Ver Transacciones"
          onClick={() => openTransaccionesModal(trabajo._id)}
        >
          <FaList />
        </button>
        <button
          className="btn delete"
          title="Eliminar"
          onClick={() => setTrabajoAEliminar(trabajo._id)}
        >
          <FaTrash />
        </button>
      </div>,
    ]);

  return (
    <div>
      <Card
        title="Gestión de Trabajos"
        description="Administra la información de los trabajos, incluyendo sus detalles y estado."
      >
        <DataTable headers={headers} data={data} />
        <div className="filter-container">
          <label htmlFor="estadoFiltro">
            <select
              name="estadoFiltro"
              label="estadoFiltro"
              id="estadoFiltro"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              {estadosTrabajo.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
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
      {detalleTrabajo && (
        <Detalle
          data={detalleTrabajo}
          onClose={() => setDetalleTrabajo(null)}
        />
      )}
      {trabajoAEliminar && (
        <Modal onClose={() => setTrabajoAEliminar(null)}>
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este trabajo?</p>
            <div className="modal-actions">
              <button
                className="btn cancel"
                onClick={() => setTrabajoAEliminar(null)}
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
        <RegistroTrabajoModal
          onClose={closeRegistroModal}
          onSuccess={handleSuccess}
          trabajoAModificar={trabajoAModificar} // Pasar el trabajo a modificar si existe
        />
      )}
      {trabajoTransacciones && (
        <TransaccionesTrabajoModal
          trabajoId={trabajoTransacciones}
          onClose={closeTransaccionesModal}
        />
      )}
    </div>
  );
}

export default Trabajo;
