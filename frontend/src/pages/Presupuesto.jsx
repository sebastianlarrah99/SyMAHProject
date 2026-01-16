import { useState, useEffect } from "react";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import Modal from "../components/Modal";
import Card from "../components/Card";
import Detalle from "../components/Detalle";
import "../styles/Presupuesto.css";

function Presupuesto() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([
    { item: "", unitPrice: 0, quantity: 0, subtotal: 0 },
  ]);
  const [clientes, setClientes] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [presupuestos, setPresupuestos] = useState([]);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [detallePresupuesto, setDetallePresupuesto] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    const fetchPresupuestos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/presupuestos"
        );
        setPresupuestos(response.data);
      } catch (error) {
        console.error("Error al obtener los presupuestos:", error);
      }
    };

    fetchClientes();
    fetchPresupuestos();
  }, []);

  const abrirModalRegistro = () => {
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setItems([{ item: "", unitPrice: 0, quantity: 0, subtotal: 0 }]); // Reinicia los items al estado base
    setDireccion("");
    setFecha("");
    setClienteSeleccionado("");
  };

  const agregarItem = () => {
    setItems([...items, { item: "", unitPrice: 0, quantity: 0, subtotal: 0 }]);
  };

  const actualizarItem = (index, field, value) => {
    const nuevosItems = [...items];
    nuevosItems[index][field] = value;
    if (field === "unitPrice" || field === "quantity") {
      nuevosItems[index].subtotal =
        nuevosItems[index].unitPrice * nuevosItems[index].quantity;
    }
    setItems(nuevosItems);
  };

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  const registrarPresupuesto = async (e) => {
    e.preventDefault();
    const nuevoPresupuesto = {
      cliente: clientes.find((c) => c._id === clienteSeleccionado)?.nombre,
      direccion,
      fecha, // Agregar el campo fecha
      total,
      items,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/presupuestos",
        nuevoPresupuesto
      );
      setPresupuestos([...presupuestos, response.data]); // Agrega el nuevo presupuesto a la lista
      cerrarModal();
    } catch (error) {
      console.error("Error al registrar el presupuesto:", error);
    }
  };

  const abrirDetallePresupuesto = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/presupuestos/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el presupuesto");
      }
      const data = await response.json();
      setDetallePresupuesto(data);
      setIsDetalleOpen(true);
    } catch (error) {
      console.error("Error al abrir el detalle del presupuesto:", error);
    }
  };

  const cerrarDetallePresupuesto = () => {
    setIsDetalleOpen(false);
    setDetallePresupuesto(null);
  };

  const eliminarPresupuesto = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/presupuestos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 204) {
        setPresupuestos((prevPresupuestos) =>
          prevPresupuestos.filter((presupuesto) => presupuesto.id !== id)
        );
        console.log("Presupuesto eliminado correctamente");
      } else {
        console.error("Error al eliminar el presupuesto");
      }
    } catch (error) {
      console.error("Error al eliminar el presupuesto:", error);
    }
  };

  return (
    <div className="presupuesto-container">
      <Card
        title="Presupuestos"
        description="Aca se muestran los presupuestos"
      />

      <button
        className="btn register"
        onClick={abrirModalRegistro}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <FaPlus />
      </button>
      {isModalOpen && (
        <Modal onClose={cerrarModal}>
          <div className="modal-content">
            <h2>Registrar Presupuesto</h2>
            <form>
              <label>Cliente:</label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
              <label>Dirección:</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <label>Fecha:</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <h4>Items</h4>
              {items.map((item, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Item"
                    value={item.item}
                    onChange={(e) =>
                      actualizarItem(index, "item", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Precio Unitario"
                    value={item.unitPrice}
                    onChange={(e) =>
                      actualizarItem(
                        index,
                        "unitPrice",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={item.quantity}
                    onChange={(e) =>
                      actualizarItem(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span>Subtotal: {item.subtotal}</span>
                </div>
              ))}
              <button
                id="add item"
                className="btn confirm"
                onClick={(e) => {
                  e.preventDefault(); // Evita el comportamiento predeterminado del formulario
                  agregarItem();
                }}
              >
                Agregar Item
              </button>
              <h4>Total: {total}</h4>
              <div className="modal-actions">
                <button
                  id="register item"
                  className="btn confirm"
                  onClick={registrarPresupuesto}
                >
                  Registrar
                </button>
                <button
                  id="cancel item"
                  className="btn cancel"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <div className="grid-container">
        {presupuestos.map((presupuesto, index) => (
          <Card className="mini-card" key={presupuesto.id || index}>
            <h3>{presupuesto.cliente}</h3>
            <p>Dirección: {presupuesto.direccion}</p>
            <p>Total: {presupuesto.total}</p>
            <div className="action-buttons">
              <button
                className="btn view"
                title="Consultar Detalle"
                onClick={() => abrirDetallePresupuesto(presupuesto.id)}
              >
                <FaEye />
              </button>
              <button
                className="btn delete"
                title="Eliminar"
                onClick={() => eliminarPresupuesto(presupuesto.id)}
              >
                <FaTrash />
              </button>
            </div>
          </Card>
        ))}
      </div>
      {isDetalleOpen && (
        <Detalle data={detallePresupuesto} onClose={cerrarDetallePresupuesto} />
      )}
    </div>
  );
}

export default Presupuesto;
