import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import ErrorBoundary from "../components/ErrorBoundary";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroTrabajoModal from "../components/RegistroTrabajoModal";
import TransaccionesTrabajoModal from "../components/TransaccionesTrabajoModal";
import { FaEye, FaEdit, FaTrash, FaList } from "react-icons/fa";
import { useRole } from "../context/useRole";
import DataTable from "../components/DataTable";

function Trabajo() {
  const { role } = useRole();

  const [trabajos, setTrabajos] = useState([]);
  const [detalleTrabajo, setDetalleTrabajo] = useState(null);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [trabajoAModificar, setTrabajoAModificar] = useState(null);
  const [trabajoTransacciones, setTrabajoTransacciones] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("activo");
  const [totalGastoManoObra, setTotalGastoManoObra] = useState(0);
  const [totalCobro, setTotalCobro] = useState(0);
  const [gananciasTotales, setGananciasTotales] = useState(0);

  const fetchTrabajos = async () => {
    try {
      const url = estadoFiltro
        ? `http://localhost:4000/api/trabajos?estado=${estadoFiltro}`
        : `http://localhost:4000/api/trabajos`;
      const response = await axios.get(url);
      setTrabajos(response.data || []);
    } catch (error) {
      console.error("Error al obtener los trabajos:", error);
      setTrabajos([]);
    }
  };

  useEffect(() => {
    fetchTrabajos();
  }, [estadoFiltro]);

  useEffect(() => {
    const calcularEstadisticas = () => {
      const totalGasto = trabajos.reduce(
        (sum, trabajo) => sum + (trabajo.gastoManoObra || 0),
        0,
      );
      const totalCobro = trabajos.reduce(
        (sum, trabajo) => sum + (trabajo.acumuladoPagos || 0),
        0,
      );
      const totalGanancias = trabajos.reduce(
        (sum, trabajo) => sum + (trabajo.ganancias || 0),
        0,
      );

      setTotalGastoManoObra(totalGasto);
      setTotalCobro(totalCobro);
      setGananciasTotales(totalGanancias);
    };

    calcularEstadisticas();
  }, [trabajos]);

  const confirmarEliminacion = async () => {
    if (trabajoAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/trabajos/${trabajoAEliminar}`,
        );
        setTrabajos(
          trabajos.filter((trabajo) => trabajo._id !== trabajoAEliminar),
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
    fetchTrabajos();
    closeRegistroModal();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const estadosTrabajo = ["pendiente", "en progreso", "completado", "activo"];
  const headers = [
    "Trabajo",
    "Estado",
    "Fecha Inicio",
    "Fecha Fin",
    "Gasto Mano de Obra",
    "Pago",
    "Ganancias",
    "Acciones",
  ];
  const data = trabajos
    .filter((trabajo) => trabajo && trabajo.titulo)
    .map((trabajo) => [
      trabajo.titulo,
      trabajo.estado,
      new Date(trabajo.fechaInicio).toLocaleDateString(),
      trabajo.fechaFin
        ? new Date(trabajo.fechaFin).toLocaleDateString()
        : "Pendiente",
      formatCurrency(trabajo.gastoManoObra),
      formatCurrency(trabajo.acumuladoPagos || 0),
      formatCurrency(trabajo.ganancias || 0),
      <div className="action-buttons">
        <button
          className="btn view"
          title="Ver más"
          onClick={() => setDetalleTrabajo(trabajo)}
        >
          <FaEye />
        </button>
        {role === "admin" && (
          <button
            className="btn edit"
            title="Modificar"
            onClick={() => openModificarModal(trabajo)}
          >
            <FaEdit />
          </button>
        )}

        <button
          className="btn list"
          title="Ver Transacciones"
          onClick={() => openTransaccionesModal(trabajo._id)}
        >
          <FaList />
        </button>
        {role === "admin" && (
          <button
            className="btn delete"
            title="Eliminar"
            onClick={() => setTrabajoAEliminar(trabajo._id)}
          >
            <FaTrash />
          </button>
        )}
      </div>,
    ]);

  const chartData = [
    { name: "Gasto Mano de Obra", value: totalGastoManoObra },
    { name: "Total Cobro", value: totalCobro },
    { name: "Ganancias Totales", value: gananciasTotales },
  ];

  return (
    <div className="card-container">
      <Card
        title="Gestión de Trabajos"
        description="Administra la información de los trabajos, incluyendo sus detalles y estado."
      ></Card>

      <div className="card-sections">
        <Card
          title="Trabajos"
          description="Lista de trabajos registrados en el sistema"
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
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>
        {role === "admin" && (
          <button className="btn new" onClick={openRegistroModal}>
            +
          </button>
        )}
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
            trabajoAModificar={trabajoAModificar}
          />
        )}
        {trabajoTransacciones && (
          <TransaccionesTrabajoModal
            trabajoId={trabajoTransacciones}
            onClose={closeTransaccionesModal}
          />
        )}
        <Card id="graphics">
          <h2>Gráficos</h2>
          <ErrorBoundary>
            <CustomBarChart data={chartData} xKey="name" barKey="value" />
            <CustomPieChart data={chartData} dataKey="value" nameKey="name" />
          </ErrorBoundary>
        </Card>
      </div>
    </div>
  );
}

export default Trabajo;
