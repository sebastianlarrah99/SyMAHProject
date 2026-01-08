import React from "react";
import ReactDOM from "react-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Enero", value: 400 },
  { name: "Febrero", value: 300 },
  { name: "Marzo", value: 200 },
  { name: "Abril", value: 278 },
  { name: "Mayo", value: 189 },
];

const TestBarChart = () => {
  return (
    <div>
      <h1>Test Bar Chart</h1>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

ReactDOM.render(<TestBarChart />, document.getElementById("root"));
