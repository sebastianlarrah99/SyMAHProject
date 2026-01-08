import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DataTable from "./DataTable";
import axios from "axios";

function TransaccionesTrabajoModal({ trabajoId, onClose }) {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/trabajos/${trabajoId}/transacciones`
        );

        if (response.data.message) {
          setMensaje(response.data.message);
          setTransacciones([]);
        } else {
          setTransacciones(response.data);
        }
      } catch (error) {
        console.error("Error al obtener las transacciones del trabajo:", error);
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error("Error del servidor:", error.response.data);
          setMensaje(
            error.response.data.message || "Error al cargar las transacciones."
          );
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error("Sin respuesta del servidor:", error.request);
          setMensaje("No se pudo conectar con el servidor.");
        } else {
          // Algo pasó al configurar la solicitud
          console.error("Error al configurar la solicitud:", error.message);
          setMensaje("Error inesperado al cargar las transacciones.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransacciones();
  }, [trabajoId]);

  const headers = ["Fecha", "Monto", "Descripción"];
  const data = transacciones.map((transaccion) => [
    new Date(transaccion.fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(transaccion.monto),

    transaccion.descripcion || "Sin descripción",
  ]);

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Transacciones Asociadas</h3>
        {loading ? (
          <p>Cargando transacciones...</p>
        ) : mensaje ? (
          <p>{mensaje}</p>
        ) : (
          <DataTable headers={headers} data={data} />
        )}
        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default TransaccionesTrabajoModal;
