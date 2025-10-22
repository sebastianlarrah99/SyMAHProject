import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { FaEye, FaEdit, FaClock, FaTrash } from "react-icons/fa";

function Trabajo() {
  const [trabajos, setTrabajos] = useState([]);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/trabajos");
        setTrabajos(response.data);
      } catch (error) {
        console.error("Error al obtener los trabajos:", error);
      }
    };

    fetchTrabajos();
  }, []);

  const headers = [
    "Trabajo",
    "Descripcion",
    "Estado",
    "Fecha Inicio",
    "Fecha Fin",
    "Tipo",
    "Gasto Mano de Obra",
    "Pago",
    "Acciones",
  ];
  const data = trabajos.map((trabajo) => [
    trabajo.titulo,
    trabajo.descripcion,
    trabajo.estado,
    new Date(trabajo.fechaInicio).toLocaleDateString(),
    trabajo.fechaFin
      ? new Date(trabajo.fechaFin).toLocaleDateString()
      : "Pendiente",
    trabajo.tipo,
    trabajo.gastoManoObra,
    trabajo.pago,
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
        title="Gestión de Trabajos"
        description="Administra la información de los trabajos, incluyendo sus detalles y asignaciones."
      >
        <DataTable headers={headers} data={data} />
      </Card>
    </div>
  );
}

export default Trabajo;
