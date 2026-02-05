import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Detalle from "../components/Detalle";
import RegistroTransaccionModal from "../components/RegistroTransaccionModal";
import { useRole } from "../context/useRole";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import Card from "../components/Card";
import ErrorBoundary from "../components/ErrorBoundary";

function Transaccion() {
  const { role } = useRole();

  const [transacciones, setTransacciones] = useState([]);
  const [detalleTransaccion, setDetalleTransaccion] = useState(null);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [yearFiltro, setYearFiltro] = useState("");
  const [monthFiltro, setMonthFiltro] = useState("");
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        let url = "http://localhost:4000/api/transacciones";
        if (yearFiltro) {
          url += `?year=${yearFiltro}`;
          if (monthFiltro) {
            url += `&month=${monthFiltro}`;
          }
        }

        const response = await axios.get(url);
        const transaccionesConNombres = response.data.map((transaccion) => ({
          ...transaccion,
          actorNombre: transaccion.actorNombre || "Actor no disponible",
        }));

        setTransacciones(transaccionesConNombres);
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    };

    fetchTransacciones();
  }, [yearFiltro, monthFiltro]);

  useEffect(() => {
    const ingresos = transacciones
      .filter((t) => t.tipo === "cobro")
      .reduce((sum, t) => sum + t.monto, 0);

    const egresos = transacciones
      .filter((t) => t.tipo === "pago" || t.tipo === "gasto")
      .reduce((sum, t) => sum + t.monto, 0);

    setTotalIngresos(ingresos);
    setTotalEgresos(egresos);
  }, [transacciones]);

  const confirmarEliminacion = async () => {
    if (transaccionAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/transacciones/${transaccionAEliminar}`,
        );
        setTransacciones(
          transacciones.filter(
            (transaccion) => transaccion._id !== transaccionAEliminar,
          ),
        );
        setTransaccionAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar la transacción:", error);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const headers = ["Actor", "Tipo", "Monto", "Fecha", "Acciones"];
  const data = transacciones.map((transaccion) => [
    transaccion.actorNombre,
    transaccion.tipo,
    formatCurrency(transaccion.monto),
    new Date(transaccion.fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
    <div className="action-buttons">
      <button
        className="btn view"
        title="Ver más"
        onClick={() =>
          setDetalleTransaccion({
            actorNombre: transaccion.actorNombre,
            tipo: transaccion.tipo,
            monto: transaccion.monto,
            fecha: new Date(transaccion.fecha).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }),
            descripcion: transaccion.descripcion || "Sin descripción",
          })
        }
      >
        <FaEye />
      </button>

      {role === "admin" && (
        <button
          className="btn delete"
          title="Eliminar"
          onClick={() => setTransaccionAEliminar(transaccion._id)}
        >
          <FaTrash />
        </button>
      )}
    </div>,
  ]);

  const closeRegistroModal = () => {
    setIsRegistroModalOpen(false);
  };

  const handleSuccess = async (transaccion) => {
    let actorNombre = "Nombre no disponible";
    try {
      if (transaccion.actorTipo === "Empleado") {
        const empleadoResponse = await axios.get(
          `http://localhost:4000/api/empleados/${transaccion.actor}`,
        );
        actorNombre = empleadoResponse.data.nombre || actorNombre;
      } else if (transaccion.actorTipo === "Trabajo") {
        const trabajoResponse = await axios.get(
          `http://localhost:4000/api/trabajos/${transaccion.actor}`,
        );
        actorNombre = trabajoResponse.data.titulo || actorNombre;
      }
    } catch (error) {
      console.error(
        "Error al obtener datos del actor o actualizar el saldo:",
        error,
      );
    } finally {
      setTransacciones((prevTransacciones) => {
        return [...prevTransacciones, { ...transaccion, actorNombre }];
      });
      closeRegistroModal();
    }
  };

  const chartData = [
    { name: "Ingresos", value: totalIngresos },
    { name: "Egresos", value: totalEgresos },
  ];

  return (
    <div>
      <Card
        title="Gestión de Transacciones"
        description="Administra las transacciones financieras, incluyendo ingresos y egresos."
      ></Card>
      <div className="card-sections">
        <Card>
          <DataTable headers={headers} data={data} />
          <div className="filter-container">
            <label htmlFor="yearFiltro">
              <select
                id="yearFiltro"
                value={yearFiltro}
                onChange={(e) => setYearFiltro(e.target.value)}
                placeholder="Ingrese el año"
              >
                <option value="">Todos</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </label>

            <label htmlFor="monthFiltro">
              <select
                id="monthFiltro"
                value={monthFiltro}
                onChange={(e) => setMonthFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </label>
          </div>
        </Card>
        <Card id="graphics">
          <h2>Gráficos</h2>
          <ErrorBoundary>
            <CustomBarChart data={chartData} xKey="name" barKey="value" />
            <CustomPieChart data={chartData} dataKey="value" nameKey="name" />
          </ErrorBoundary>
          <h3>Totales</h3>
          <p>Ingresos: {totalIngresos}</p> <p>Egresos: {totalEgresos}</p>
        </Card>
      </div>

      {role === "admin" && (
        <button
          className="btn new"
          onClick={() => setIsRegistroModalOpen(true)}
        >
          +
        </button>
      )}
      {detalleTransaccion && (
        <Detalle
          data={detalleTransaccion}
          onClose={() => setDetalleTransaccion(null)}
        />
      )}
      {transaccionAEliminar && (
        <Modal onClose={() => setTransaccionAEliminar(null)}>
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar esta transacción?</p>
            <div className="modal-actions">
              <button
                className="btn cancel"
                onClick={() => setTransaccionAEliminar(null)}
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
        <RegistroTransaccionModal
          onClose={closeRegistroModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Transaccion;
