import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { FaEye, FaEdit, FaClock, FaTrash } from "react-icons/fa";

function Transaccion() {
  const [transacciones, setTransacciones] = useState([]);

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

  const headers = ["Actor", "Actor Tipo", "Tipo", "Monto", "Fecha", "Acciones"];
  const data = transacciones.map((transaccion) => [
    transaccion.actorNombre,
    transaccion.actorTipo,
    transaccion.tipo,
    transaccion.monto,
    transaccion.fecha,
    <div className="action-buttons">
      <button className="btn view" title="Ver más">
        <FaEye />
      </button>
      <button className="btn edit" title="Modificar">
        <FaEdit />
      </button>
      <button className="btn clock" title="Registrar horas">
        <FaClock />
      </button>
      <button className="btn delete" title="Eliminar">
        <FaTrash />
      </button>
    </div>,
  ]);

  return (
    <div>
      <Card
        title="Gestión de Transacciones"
        description="Administra las transacciones financieras, incluyendo pagos y cobros."
      >
        <DataTable headers={headers} data={data} />
      </Card>
    </div>
  );
}

export default Transaccion;
