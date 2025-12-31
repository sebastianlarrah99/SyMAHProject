import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

function ConfigModal({ onClose, onSuccess = () => {} }) {
  const [cargos, setCargos] = useState([]);
  const [modo, setModo] = useState("crear"); // "crear" o "modificar"
  const [cargoSeleccionado, setCargoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [pagoPorHora, setPagoPorHora] = useState("");

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

  const handleModoChange = (e) => {
    setModo(e.target.value);
    setCargoSeleccionado("");
    setNombre("");
    setPagoPorHora("");
  };

  const handleCargoChange = (e) => {
    const cargoId = e.target.value;
    setCargoSeleccionado(cargoId);

    const cargo = cargos.find((c) => c._id === cargoId);
    if (cargo) {
      setNombre(cargo.nombre || ""); // Asegurar que el valor sea una cadena
      setPagoPorHora(cargo.pagoPorHora || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modo === "crear") {
        await axios.post("http://localhost:4000/api/cargos", {
          nombre,
          pagoPorHora,
        });
      } else if (modo === "modificar" && cargoSeleccionado) {
        await axios.put(
          `http://localhost:4000/api/cargos/${cargoSeleccionado}`,
          {
            nombre,
            pagoPorHora,
          }
        );
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar el cargo:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Configuración de Cargos</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <label>
              Modo
              <select value={modo} onChange={handleModoChange}>
                <option value="crear">Crear Nuevo Cargo</option>
                <option value="modificar">Modificar Cargo Existente</option>
              </select>
            </label>{" "}
            {modo === "modificar" && (
              <label>
                Seleccionar Cargo
                <select value={cargoSeleccionado} onChange={handleCargoChange}>
                  <option value="">-- Seleccionar --</option>
                  {cargos.map((cargo) => (
                    <option key={cargo._id} value={cargo._id}>
                      {cargo.nombre}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="form-group">
              <label>
                Nombre
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Pago por Hora
                <input
                  type="number"
                  value={pagoPorHora}
                  onChange={(e) => setPagoPorHora(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        </form>
        <div className="modal-actions">
          <button type="submit" className="btn confirm">
            Guardar
          </button>
          <button type="button" className="btn cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfigModal;
