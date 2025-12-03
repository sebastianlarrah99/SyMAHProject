import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroTransaccionModal from "../components/RegistroTransaccionModal";
import { FaEye, FaTrash } from "react-icons/fa";

function Transaccion() {
  const [transacciones, setTransacciones] = useState([]);
  const [detalleTransaccion, setDetalleTransaccion] = useState(null);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/transacciones"
        );

        // Obtener nombres de actores
        const transaccionesConNombres = await Promise.all(
          response.data.map(async (transaccion) => {
            let actorNombre = "";
            try {
              if (transaccion.actorTipo === "Empleado") {
                const empleadoResponse = await axios.get(
                  `http://localhost:4000/api/empleados/${transaccion.actor}`
                );
                actorNombre =
                  empleadoResponse.data.nombre || "Nombre no disponible";
              } else if (transaccion.actorTipo === "Trabajo") {
                const trabajoResponse = await axios.get(
                  `http://localhost:4000/api/trabajos/${transaccion.actor}`
                );
                actorNombre =
                  trabajoResponse.data.trabajo.titulo || "Título no disponible";
              }
            } catch {
              console.error(
                `ID no encontrado: ${transaccion.actor} en la colección ${transaccion.actorTipo}`
              );
            }
            return { ...transaccion, actorNombre };
          })
        );

        setTransacciones(transaccionesConNombres);
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    };

    fetchTransacciones();
  }, []);

  const confirmarEliminacion = async () => {
    if (transaccionAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/transacciones/${transaccionAEliminar}`
        );
        setTransacciones(
          transacciones.filter(
            (transaccion) => transaccion._id !== transaccionAEliminar
          )
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

      <button
        className="btn delete"
        title="Eliminar"
        onClick={() => setTransaccionAEliminar(transaccion._id)}
      >
        <FaTrash />
      </button>
    </div>,
  ]);

  const closeRegistroModal = () => {
    setIsRegistroModalOpen(false);
  };

  const handleSuccess = async (transaccion) => {
    try {
      let actorNombre = "";
      if (transaccion.actorTipo === "Empleado") {
        const empleadoResponse = await axios.get(
          `http://localhost:4000/api/empleados/${transaccion.actor}`
        );
        actorNombre = empleadoResponse.data.nombre || "Nombre no disponible";
      } else if (transaccion.actorTipo === "Trabajo") {
        const trabajoResponse = await axios.get(
          `http://localhost:4000/api/trabajos/${transaccion.actor}`
        );
        actorNombre =
          trabajoResponse.data.trabajo.titulo || "Título no disponible";
      }

      setTransacciones((prevTransacciones) => {
        return [...prevTransacciones, { ...transaccion, actorNombre }];
      });
    } catch (error) {
      console.error(
        "Error al obtener datos del actor o actualizar el saldo:",
        error
      );
    } finally {
      closeRegistroModal();
    }
  };

  return (
    <div>
      <Card
        title="Gestión de Transacciones"
        description="Administra las transacciones financieras, incluyendo ingresos y egresos."
      >
        <DataTable headers={headers} data={data} />
      </Card>
      <button
        className="btn register"
        onClick={() => {
          setIsRegistroModalOpen(true);
        }}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        +
      </button>
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
