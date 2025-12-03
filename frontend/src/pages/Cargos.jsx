import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", pagoPorHora: 0 });
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/cargos");
        setCargos(response.data);
      } catch (error) {
        console.error("Error al obtener los cargos:", error);
      }
    };

    fetchCargos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cargoSeleccionado) {
        await axios.put(
          `http://localhost:4000/api/cargos/${cargoSeleccionado._id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:4000/api/cargos", formData);
      }
      setIsModalOpen(false);
      setCargoSeleccionado(null);
      setFormData({ nombre: "", pagoPorHora: 0 });
      const response = await axios.get("http://localhost:4000/api/cargos");
      setCargos(response.data);
    } catch (error) {
      console.error("Error al guardar el cargo:", error);
    }
  };

  const openModal = (cargo = null) => {
    if (cargo) {
      setCargoSeleccionado(cargo);
      setFormData({ nombre: cargo.nombre, pagoPorHora: cargo.pagoPorHora });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCargoSeleccionado(null);
    setFormData({ nombre: "", pagoPorHora: 0 });
  };

  const headers = ["Nombre", "Pago por Hora", "Acciones"];
  const data = cargos.map((cargo) => [
    cargo.nombre,
    `$${cargo.pagoPorHora.toFixed(2)}`,
    <div className="action-buttons">
      <button className="btn edit" onClick={() => openModal(cargo)}>
        Modificar
      </button>
    </div>,
  ]);

  return (
    <div>
      <h1>Gestión de Cargos</h1>
      <button className="btn add" onClick={() => openModal()}>
        + Agregar Cargo
      </button>
      <DataTable headers={headers} data={data} />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="modal-content">
            <h3>{cargoSeleccionado ? "Modificar Cargo" : "Agregar Cargo"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pagoPorHora">Pago por Hora</label>
                <input
                  type="number"
                  id="pagoPorHora"
                  name="pagoPorHora"
                  value={formData.pagoPorHora}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn cancel"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn confirm">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Cargos;
