import React, { useState, useEffect } from "react";
import "../styles/Modal.css";

function Modal({ children, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Activar la animación de apertura
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500); // Duración de la animación de cierre
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}></div>
      <div
        className={`modal ${isVisible ? "visible" : ""} ${
          isClosing ? "hidden" : ""
        }`}
      >
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </>
  );
}

export default Modal;
