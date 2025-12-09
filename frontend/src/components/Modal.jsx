import React, { useState } from "react";
import "../styles/Modal.css";
import Card from "./Card";

function Modal({ children, onClose, title, description }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación de cierre (coincide con el CSS)
  };

  return (
    <Card>
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className={`modal ${isClosing ? "closing" : ""}`}>
        <button className="modal-close" onClick={handleClose} id="close-button">
          &times;
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        {description && <p className="modal-description">{description}</p>}
        {children}
      </div>
    </Card>
  );
}

export default Modal;
