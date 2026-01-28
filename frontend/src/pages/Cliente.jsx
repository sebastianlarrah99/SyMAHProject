import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroClienteModal from "../components/RegistroClienteModal";
import TrabajosClienteModal from "../components/TrabajosClienteModal";
import { FaEye, FaEdit, FaTrash, FaList } from "react-icons/fa";
import { useRole } from "../context/useRole";
import ErrorBoundary from "../components/ErrorBoundary";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";

function Cliente() {
  const { role } = useRole();
  console.log("Rol actual en Cliente:", role);

  useEffect(() => {
    console.log("Rol actual del usuario desde el contexto:", role); // Depuración
  }, [role]);

  const [clientes, setClientes] = useState([]);
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [clienteAModificar, setClienteAModificar] = useState(null);
  const [clienteTrabajos, setClienteTrabajos] = useState(null);

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

  const confirmarEliminacion = async () => {
    if (clienteAEliminar) {
      try {
        await axios.delete(
          `http://localhost:4000/api/clientes/${clienteAEliminar}`,
        );
        setClientes(
          clientes.filter((cliente) => cliente._id !== clienteAEliminar),
        );
        setClienteAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  const openModificarModal = (cliente) => {
    setClienteAModificar(cliente);
    setIsRegistroModalOpen(true);
  };

  const openTrabajosModal = (clienteId) => {
    setClienteTrabajos(clienteId);
  };

  const closeRegistroModal = () => {
    setIsRegistroModalOpen(false);
    setClienteAModificar(null);
  };

  const closeTrabajosModal = () => {
    setClienteTrabajos(null);
  };

  const handleSuccess = (nuevoCliente) => {
    if (clienteAModificar) {
      // Actualizar cliente existente en la tabla
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente._id === nuevoCliente._id ? nuevoCliente : cliente,
        ),
      );
    } else {
      // Agregar nuevo cliente a la tabla
      setClientes((prevClientes) => [...prevClientes, nuevoCliente]);
    }
    closeRegistroModal();
  };

  const headers = ["Nombre", "Email", "Telefono", "Direccion", "Acciones"];

  const data = clientes.map((cliente) => [
    cliente.nombre,
    cliente.email,
    cliente.telefono,
    cliente.direccion,
    <div className="action-buttons">
      <button
        className="btn view"
        title="Ver más"
        onClick={() => setDetalleCliente(cliente)}
      >
        <FaEye />
      </button>
      {role === "admin" && (
        <button
          className="btn edit"
          title="Modificar"
          onClick={() => openModificarModal(cliente)}
        >
          <FaEdit />
        </button>
      )}

      <button
        className="btn list"
        title="Ver Trabajos"
        onClick={() => openTrabajosModal(cliente._id)}
      >
        <FaList />
      </button>
      {role === "admin" && (
        <button
          className="btn delete"
          title="Eliminar"
          onClick={() => setClienteAEliminar(cliente._id)}
        >
          <FaTrash />
        </button>
      )}
    </div>,
  ]);
  const [totalPagado, setTotalPagado] = useState(0);
  const [totalSaldo, setTotalSaldo] = useState(0);

  useEffect(() => {
    // Calcular el total pagado y el total del gasto en mano de obra
    let totalPagos = 0;
    let totalGastoMO = 0;
    clientes.forEach((cliente) => {
      totalPagos += cliente.totalPagos || 0; // Asegurarse de que sea un número válido
      totalGastoMO += cliente.totalGastoMO || 0; // Asegurarse de que sea un número válido
    });
    setTotalPagado(totalPagos);
    setTotalSaldo(totalGastoMO);
  }, [clientes]);

  const chartData = [
    { name: "Total Pagado", value: totalPagado },
    { name: "Total Saldo", value: totalSaldo },
  ];

  return (
    <div>
      <Card
        title="Gestión de Clientes"
        description="Administra la información de los clientes, incluyendo sus datos de contacto."
      ></Card>
      <div className="card-sections">
        <Card>
          <DataTable headers={headers} data={data} />
        </Card>
        <Card id="graphics">
          <h2>Graficos</h2>
          <ErrorBoundary>
            <CustomBarChart data={chartData} xKey="name" barKey="value" />
            <CustomPieChart data={chartData} dataKey="value" nameKey="name" />
            <div>
              <h3>Totales</h3>
              <p>Total Pagado: {totalPagado}</p>
              <p>Total Saldo: {totalSaldo}</p>
            </div>
          </ErrorBoundary>
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
      {detalleCliente && (
        <Detalle
          data={detalleCliente}
          onClose={() => setDetalleCliente(null)}
        />
      )}
      {clienteAEliminar && (
        <Modal onClose={() => setClienteAEliminar(null)}>
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este cliente?</p>
            <div className="modal-actions">
              <button
                className="btn cancel"
                onClick={() => setClienteAEliminar(null)}
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
        <RegistroClienteModal
          cliente={clienteAModificar}
          onClose={closeRegistroModal}
          onSuccess={handleSuccess}
        />
      )}
      {clienteTrabajos && (
        <TrabajosClienteModal
          clienteId={clienteTrabajos}
          onClose={closeTrabajosModal}
        />
      )}
    </div>
  );
}

export default Cliente;
