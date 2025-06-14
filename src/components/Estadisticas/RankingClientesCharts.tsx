import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { usePeriodo } from "./PeriodoContext"; // Ajustá el path

export default function RankingClientesChart() {
  const { periodo } = usePeriodo();

  const [data, setData] = useState<any[][]>([
    ["Cliente", "Cantidad de pedidos"],
  ]);

  useEffect(() => {
    fetch(`/api/clientes-ranking?periodo=${periodo}`)
      .then((res) => res.json())
      .then((json) => {
        // Supongamos que el backend devuelve:
        // [{ cliente: "Juan Pérez", pedidos: 25 }, ...]
        const chartData = [
          ["Cliente", "Cantidad de pedidos"],
          ...json.map((item: any) => [item.cliente, item.pedidos]),
        ];
        setData(chartData);
      })
      .catch((err) =>
        console.error("Error cargando ranking de clientes:", err)
      );
  }, [periodo]);

  const options = {
    title: "Ranking clientes por cantidad de pedidos",
    chartArea: { width: "70%" },
    legend: { position: "none" },
    hAxis: {
      title: "Cantidad de pedidos",
      minValue: 0,
    },
    vAxis: {
      title: "Cliente",
    },
    colors: ["#1976d2"],
  };

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
