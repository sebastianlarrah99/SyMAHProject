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
        setMensaje("Error al cargar las transacciones.");
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
          <button className="btn close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default TransaccionesTrabajoModal;
