import React from "react";
import "../styles/DataTable.css";

const DataTable = ({ headers, data }) => {
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
              <td>{row.name}</td>
              <td>{row.formattedValue || row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
