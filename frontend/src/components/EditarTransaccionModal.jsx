import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

function EditarTransaccionModal({ onClose, onSuccess, transaccion }) {
  const [formData, setFormData] = useState({
    monto: transaccion?.monto || 0,
    descripcion: transaccion?.descripcion || "",
  });

  const [isGasto, setIsGasto] = useState(false);
  const [actor, setActor] = useState("");

  const actorOptions = [
    "Material",
    "Arreglo",
    "Impuesto",
    "Seguro",
    "Herramienta",
    "Combustible",
    "Otro",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActorChange = (e) => {
    setActor(e.target.value);
  };

  const handleGastoToggle = () => {
    setIsGasto(!isGasto);
    if (!isGasto) {
      setActor("Gasto");
    } else {
      setActor("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/transacciones/${transaccion._id}`,
        {
          monto: formData.monto,
          descripcion: formData.descripcion,
        }
      );
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error al editar la transacción:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <h3>Modificar Transacción</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="monto">Monto</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="isGasto">
              <input
                type="checkbox"
                id="isGasto"
                checked={isGasto}
                onChange={handleGastoToggle}
              />
              Marcar como Gasto
            </label>
          </div>
          {isGasto ? (
            <div className="form-group">
              <label htmlFor="actor">Tipo de Gasto</label>
              <select
                id="actor"
                name="actor"
                value={actor}
                onChange={handleActorChange}
                required
              >
                <option value="">Seleccione una opción</option>
                {actorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="actor">Actor</label>
              <input
                type="text"
                id="actor"
                name="actor"
                value={actor}
                onChange={handleActorChange}
                required
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="submit" className="btn confirm">
              Modificar
            </button>
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditarTransaccionModal;
