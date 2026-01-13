import React from "react";
import "../styles/DataTable.css";

const DataTable = ({ headers, data }) => {
  // Validar que los datos sean un array de arrays
  const isValidData =
    Array.isArray(data) && data.every((row) => Array.isArray(row));

  if (!isValidData) {
    console.error(
      "El formato de los datos no es válido. Se esperaba un array de arrays."
    );
    return <div>Error: Formato de datos inválido.</div>;
  }

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr className="table-row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
