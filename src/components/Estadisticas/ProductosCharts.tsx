import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { usePeriodo } from "./PeriodoContext"; // ajustá el path si hace falta

export default function ProductosChart() {
  const { periodo } = usePeriodo();

  const [data, setData] = useState<any[][]>([
    ["Producto", "Cantidad Vendida"],
  ]);

  useEffect(() => {
    // Simulación: reemplazá esto con tu fetch real
    fetch(`/api/productos-mas-vendidos?periodo=${periodo}`)
      .then((res) => res.json())
      .then((json) => {
        // Supongamos que el backend devuelve un array tipo:
        // [{ producto: "Hamburguesa", cantidad: 120 }, ...]
        const chartData = [
          ["Producto", "Cantidad Vendida"],
          ...json.map((item: any) => [item.producto, item.cantidad]),
        ];
        setData(chartData);
      })
      .catch((err) => console.error("Error cargando productos más vendidos:", err));
  }, [periodo]);

  const options = {
    title: "Productos más vendidos",
    legend: { position: "none" },
    colors: ["#f44336"],
    hAxis: { slantedText: true },
  };

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
}
