import { useState, useEffect } from "react";
import Card from "../components/Card";
import "../styles/Estadisticas.css";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import ErrorBoundary from "../components/ErrorBoundary";
import axios from "axios";
import DataTable from "../components/DataTable";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
function Estadisticas() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Encabezados para la tabla
  const encabezado = ["Mes", "Ganancias"];

  // Función para formatear valores como moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  // Modificar las funciones para mantener valores numéricos en los gráficos
  const obtenerGananciasPorMes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/trabajos/calcular/ganancias-por-mes",
      );
      console.log("Datos recibidos del backend:", response.data);

      const datos = response.data.map((item) => {
        const mesNombre = meses[item.mes - 1] || `Mes ${item.mes}`;
        return {
          name: mesNombre,
          value: item.ganancias, // Mantener valores numéricos
          formattedValue: formatearMoneda(item.ganancias), // Agregar formato solo para mostrar
        };
      });
      setChartData(datos);
      setPieData(datos);
    } catch (error) {
      console.error("Error al obtener las ganancias por mes:", error);
    }
  };

  const obtenerCobradoPorMes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/trabajos/calcular/cobrado-por-mes",
      );
      console.log("Datos de cobrado recibidos del backend:", response.data);

      const datos = response.data.map((item) => {
        const mesNombre = meses[item.mes - 1] || `Mes ${item.mes}`;
        return {
          name: mesNombre,
          value: item.cobrado, // Mantener valores numéricos
          formattedValue: formatearMoneda(item.cobrado), // Agregar formato solo para mostrar
        };
      });
      setChartData(datos);
      setPieData(datos);
    } catch (error) {
      console.error("Error al obtener lo cobrado por mes:", error);
    }
  };

  const obtenerPagosPorMes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/empleados/calcular/pagos-por-mes",
      );
      console.log("Datos de pagos recibidos del backend:", response.data);

      const datos = response.data.map((item) => {
        const mesNombre = meses[item.mes - 1] || `Mes ${item.mes}`;
        return {
          name: mesNombre,
          value: item.pagos, // Mantener valores numéricos
          formattedValue: formatearMoneda(item.pagos), // Agregar formato solo para mostrar
        };
      });
      setChartData(datos);
      setPieData(datos);
    } catch (error) {
      console.error("Error al obtener los pagos por mes:", error);
    }
  };

  const obtenerGastosPorMes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/transacciones/calcular/gastos-por-mes",
      );
      console.log("Datos de gastos recibidos del backend:", response.data);

      const datos = response.data.map((item) => {
        const mesNombre = meses[item.mes - 1] || `Mes ${item.mes}`;
        return {
          name: mesNombre,
          value: item.totalGastos, // Mantener valores numéricos
          formattedValue: formatearMoneda(item.totalGastos), // Agregar formato solo para mostrar
        };
      });
      setChartData(datos);
      setPieData(datos);
    } catch (error) {
      console.error("Error al obtener los gastos por mes:", error);
    }
  };

  useEffect(() => {
    if (selectedOption === "option1") {
      obtenerGananciasPorMes();

      // Configurar polling para actualizar los datos cada 10 segundos
      const interval = setInterval(() => {
        obtenerGananciasPorMes();
      }, 1000000);

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    } else if (selectedOption === "option2") {
      obtenerCobradoPorMes();

      // Configurar polling para actualizar los datos cada 10 segundos
      const interval = setInterval(() => {
        obtenerCobradoPorMes();
      }, 1000000);

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    } else if (selectedOption === "option3") {
      obtenerPagosPorMes();

      // Configurar polling para actualizar los datos cada 10 segundos
      const interval = setInterval(() => {
        obtenerPagosPorMes();
      }, 1000000);

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    } else if (selectedOption === "option4") {
      obtenerGastosPorMes();

      // Configurar polling para actualizar los datos cada 10 segundos
      const interval = setInterval(() => {
        obtenerGastosPorMes();
      }, 1000000);

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);

    // Actualizar los datos según la opción seleccionada
    if (option === "option1") {
      obtenerGananciasPorMes();
    } else if (option === "option2") {
      obtenerCobradoPorMes();
    } else if (option === "option3") {
      obtenerPagosPorMes();
    } else if (option === "option4") {
      obtenerGastosPorMes();
    } else {
      setChartData([]);
      setPieData([]);
    }
  };

  // Transformar los datos para la tabla
  const dataParaTabla = chartData.map((item) => [
    item.name,
    item.formattedValue,
  ]);

  return (
    <div className="card-container">
      <Card
        title="Estadísticas"
        description="Consulta las estadisticas mensuales de SyMAH"
      ></Card>

      <div className="card-sections">
        <Card id="data">
          <h2>Datos</h2>
          <p>Seleccione los datos que desea filtrar.</p>
          <select
            name="option"
            onChange={handleOptionChange}
            value={selectedOption}
          >
            <option value="option1">Ganancias</option>
            <option value="option2">Cobrado</option>
            <option value="option3">Pagado</option>
            <option value="option4">Gastos</option>
          </select>
          <div>
            <DataTable headers={encabezado} data={dataParaTabla} />
          </div>
        </Card>

        <Card id="graphics">
          <h2>Gráficos</h2>
          <ErrorBoundary>
            <CustomBarChart data={chartData} xKey="name" barKey="value" />
            <CustomPieChart data={pieData} dataKey="value" nameKey="name" />
          </ErrorBoundary>
        </Card>
      </div>
    </div>
  );
}

export default Estadisticas;
