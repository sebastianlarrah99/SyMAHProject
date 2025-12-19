import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Detalle from "../components/Detalle";
import Modal from "../components/Modal";
import RegistroClienteModal from "../components/RegistroClienteModal";
import TrabajosClienteModal from "../components/TrabajosClienteModal";
import { FaEye, FaEdit, FaTrash, FaList } from "react-icons/fa";

function Cliente() {
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
          `http://localhost:4000/api/clientes/${clienteAEliminar}`
        );
        setClientes(
          clientes.filter((cliente) => cliente._id !== clienteAEliminar)
        );
        setClienteAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  const openRegistroModal = () => {
    setIsRegistroModalOpen(true);
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
          cliente._id === nuevoCliente._id ? nuevoCliente : cliente
        )
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
      <button
        className="btn edit"
        title="Modificar"
        onClick={() => openModificarModal(cliente)}
      >
        <FaEdit />
      </button>
      <button
        className="btn list"
        title="Ver Trabajos"
        onClick={() => openTrabajosModal(cliente._id)}
      >
        <FaList />
      </button>
      <button
        className="btn delete"
        title="Eliminar"
        onClick={() => setClienteAEliminar(cliente._id)}
      >
        <FaTrash />
      </button>
    </div>,
  ]);

  return (
    <div>
      <Card
        title="Gestión de Clientes"
        description="Administra la información de los clientes, incluyendo sus datos de contacto."
      ></Card>
      <Card>
        <DataTable headers={headers} data={data} />
      </Card>
      <button
        className="btn register"
        onClick={openRegistroModal}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        +
      </button>
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
