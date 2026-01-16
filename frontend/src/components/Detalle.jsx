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
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>
              {Object.entries(item)
                .filter(([subKey]) => subKey !== "_id") // Excluir el campo _id
                .map(([subKey, subValue]) => (
                  <div key={subKey}>
                    <strong>{formatKey(subKey)}:</strong> {subValue.toString()}
                  </div>
                ))}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <ul>
          {Object.entries(value)
            .filter(([subKey]) => subKey !== "_id") // Excluir el campo _id
            .map(([subKey, subValue]) => (
              <li key={subKey}>
                <strong>{formatKey(subKey)}:</strong> {subValue.toString()}
              </li>
            ))}
        </ul>
      );
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
        <h2>
          {data.nombre || data.titulo || `Detalle del Trabajo ${data.id}`}
        </h2>
        <ul>
          {Object.entries(data)
            .filter(
              ([key]) =>
                key !== "id" &&
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
