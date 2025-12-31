import React, { useEffect } from "react";
import Modal from "./Modal";
import "../styles/detalle.css";

function Detalle({ data, onClose }) {
  useEffect(() => {
    console.log("Datos recibidos en el componente Detalle:", data);
  }, [data]);

  const formatKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Agregar espacio entre palabras en camelCase
      .replace(/_/g, " ") // Reemplazar guiones bajos con espacios
      .replace(/^./, (str) => str.toUpperCase()); // Capitalizar la primera letra
  };

  const formatValue = (key, value) => {
    if (key.toLowerCase() === "cliente" || key.toLowerCase() === "cargo") {
      // Mostrar el nombre del cliente o cargo si está disponible
      if (typeof value === "object" && value.nombre) {
        return value.nombre;
      }
      return value; // En caso de que no sea un objeto o no tenga nombre
    }

    if (
      key.toLowerCase().includes("gasto") ||
      key.toLowerCase().includes("pago") ||
      key.toLowerCase().includes("saldo") ||
      key.toLowerCase().includes("cobro") ||
      key.toLowerCase().includes("precio") ||
      key.toLowerCase().includes("pagadomes") ||
      key.toLowerCase().includes("totalpagos") ||
      key.toLowerCase().includes("pagado") ||
      key.toLowerCase().includes("total") ||
      key.toLowerCase().includes("monto") ||
      key.toLowerCase().includes("ganancia")
    ) {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(value);
    }

    return value;
  };

  return (
    <Modal onClose={onClose}>
      <div className="detalle-container">
        <h2>{data.nombre || data.titulo || "Detalle"}</h2>
        <ul>
          {Object.entries(data)
            .filter(
              ([key]) =>
                key !== "_id" &&
                key !== "__v" &&
                key.toLowerCase() !== "createdat" &&
                key.toLowerCase() !== "updatedat"
            )
            .map(([key, value]) => (
              <li key={key}>
                <strong>{formatKey(key)}:</strong> {formatValue(key, value)}
              </li>
            ))}
        </ul>
      </div>
    </Modal>
  );
}

export default Detalle;
