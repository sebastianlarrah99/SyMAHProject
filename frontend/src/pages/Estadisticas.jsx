import { useState, useEffect } from "react";
import Card from "../components/Card";
import "../styles/Estadisticas.css";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import ErrorBoundary from "../components/ErrorBoundary";
import axios from "axios";

const pieChartData = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
  { name: "Grupo D", value: 200 },
];

function Estadisticas() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [chartData, setChartData] = useState([]);

  // Función para obtener ganancias por mes desde el backend
  const obtenerGananciasPorMes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/trabajos/calcular/ganancias-por-mes"
      );
      console.log("Datos recibidos del backend:", response.data);
      const datos = response.data.map((item) => ({
        name: `Mes ${item.mes}`,
        value: item.ganancias,
      }));
      setChartData(datos);
    } catch (error) {
      console.error("Error al obtener las ganancias por mes:", error);
    }
  };

  useEffect(() => {
    if (selectedOption === "option1") {
      obtenerGananciasPorMes();

      // Configurar polling para actualizar los datos cada 10 segundos
      const interval = setInterval(() => {
        obtenerGananciasPorMes();
      }, 10000);

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);

    // Actualizar los datos según la opción seleccionada
    if (option === "option1") {
      obtenerGananciasPorMes();
    } else {
      setChartData([]); // Aquí puedes agregar lógica para otras opciones
    }
  };

  return (
    <div className="estadisticas container">
      <Card>
        <h2>Estadísticas</h2>
        <p>Aquí se mostrarán las estadísticas relevantes.</p>
      </Card>

      <div className="statistics-sections">
        <Card id="data">
          <h2>Datos</h2>
          <p>Seleccione los datos que desea filtrar.</p>
          <select
            name="option"
            onChange={handleOptionChange}
            value={selectedOption}
          >
            <option value="option1">Ganancias</option>
            <option value="option3">Cobrado</option>
            <option value="option4">Pagado</option>
            <option value="option5">Gastos</option>
          </select>
        </Card>

        <Card id="graphics">
          <h2>Gráficos</h2>
          <ErrorBoundary>
            <CustomBarChart data={chartData} xKey="name" barKey="value" />
            <CustomPieChart
              data={pieChartData}
              dataKey="value"
              nameKey="name"
            />
          </ErrorBoundary>
        </Card>
      </div>
    </div>
  );
}

export default Estadisticas;
