import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DataTable from "./DataTable";
import axios from "axios";

function TrabajosClienteModal({ clienteId, onClose }) {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/clientes/${clienteId}/trabajos-detalles`
        );

        if (response.data.message) {
          setMensaje(response.data.message);
          setTrabajos([]);
        } else {
          setTrabajos(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los trabajos del cliente:", error);
        setMensaje("Error al cargar los trabajos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, [clienteId]);

  const headers = [
    "Título",
    "Descripción",
    "Total Pagos",
    "Total Gastos Mano de Obra",
  ];
  const data = trabajos.map((trabajo) => [
    trabajo.titulo,
    trabajo.descripcion,
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(trabajo.totalPagos),
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(trabajo.totalGastosManoObra),
  ]);

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Trabajos Asociados</h3>
        {loading ? (
          <p>Cargando trabajos...</p>
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

export default TrabajosClienteModal;
