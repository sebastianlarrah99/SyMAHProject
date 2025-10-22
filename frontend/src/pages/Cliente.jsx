import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Cliente() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const headers = ["Nombre", "Email", "Telefono", "Direccion", "Acciones"];
  const data = clientes.map((cliente) => [
    cliente.nombre,
    cliente.email,
    cliente.telefono,
    cliente.direccion,
    <div className="action-buttons">
      <button className="btn view" title="Ver más">
        <FaEye />
      </button>
      <button className="btn edit" title="Modificar">
        <FaEdit />
      </button>
      <button className="btn delete" title="Eliminar">
        <FaTrash />
      </button>
    </div>,
  ]);

  return (
    <div>
      <Card
        title="Gestión de Clientes"
        description="Administra la información de los clientes, incluyendo sus datos de contacto y proyectos asignados."
      >
        <DataTable headers={headers} data={data} />
      </Card>
    </div>
  );
}

export default Cliente;
