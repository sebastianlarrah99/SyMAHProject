import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import RegisterHoursModal from "../components/RegistroHoras";
import { FaEye, FaEdit, FaClock, FaTrash } from "react-icons/fa";

function Empleado() {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/empleados");
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  const openModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // Refrescar la lista de empleados después de registrar horas
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/empleados");
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmpleados();
  };

  const headers = [
    "Nombre",
    "Cargo",
    "Departamento",
    "Estado",
    "Saldo",
    "Acciones",
  ];
  const data = empleados.map((empleado) => [
    empleado.nombre,
    empleado.cargo,
    empleado.departamento,
    empleado.estado,
    `$${empleado.saldo.toFixed(2)}`,
    <div className="action-buttons">
      <button className="btn view" title="Ver más">
        <FaEye />
      </button>
      <button className="btn edit" title="Modificar">
        <FaEdit />
      </button>
      <button
        className="btn clock"
        title="Registrar horas"
        onClick={() => openModal(empleado)}
      >
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
        title="Gestión de Empleados"
        description="Administra la información de los empleados, incluyendo sus datos personales y horarios."
      >
        <DataTable headers={headers} data={data} />
      </Card>
      {isModalOpen && selectedEmpleado && (
        <RegisterHoursModal
          empleadoId={selectedEmpleado._id}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Empleado;
