import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { usePeriodo } from "./PeriodoContext";
import { fetchClientesRanking } from "../../services/EstadisticasApi";

export default function RankingClientesChart() {
  const { periodo } = usePeriodo();

  const [datosOriginales, setDatosOriginales] = useState<any[][]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const clientesPorPagina = 15;
  const [data, setData] = useState<any[][]>([]);

  useEffect(() => {
    fetchClientesRanking(periodo)
      .then((res: any[][]) => {
        setDatosOriginales(res);
        setPaginaActual(0); // Reiniciar al cambiar período
      })
      .catch((err) =>
        console.error("Error cargando ranking de clientes:", err)
      );
  }, [periodo]);

  useEffect(() => {
    const encabezado = [
      { type: "string", label: "Cliente" },
      { type: "number", label: "Cantidad de pedidos" },
      { type: "string", role: "tooltip" },
    ];

    const cuerpo = datosOriginales
      .slice(
        paginaActual * clientesPorPagina,
        (paginaActual + 1) * clientesPorPagina
      )
      .map(([cliente, pedidos, total]) => [
        cliente,
        pedidos,
        `Cliente: ${cliente}\nPedidos: ${pedidos}\nTotal: $${Number(total).toLocaleString("es-AR")}`,
      ]);

    setData([encabezado, ...cuerpo]);
  }, [paginaActual, datosOriginales]);

  const totalPaginas = Math.ceil(datosOriginales.length / clientesPorPagina);

  const options = {
    title: "Pedidos por cliente",
    chartArea: { width: "70%" },
    hAxis: {
      title: "Cantidad de pedidos",
      minValue: 0,
    },
    vAxis: {
      title: "Cliente",
    },
    legend: "none",
    tooltip: { isHtml: true },
    colors: ["#1976d2"],
  };

  return (
    <div>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
          disabled={paginaActual === 0}
        >
          Anterior
        </button>
        <span>Página {paginaActual + 1} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas - 1))}
          disabled={paginaActual >= totalPaginas - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
