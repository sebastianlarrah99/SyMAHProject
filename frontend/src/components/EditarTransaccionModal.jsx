import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

function EditarTransaccionModal({ onClose, onSuccess, transaccion }) {
  const [formData, setFormData] = useState({
    monto: transaccion?.monto || 0,
    descripcion: transaccion?.descripcion || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn confirm">
              Modificar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditarTransaccionModal;
