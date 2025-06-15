import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { usePeriodo } from "./PeriodoContext"; 
import { fetchProductosMasVendidos } from "../../services/EstadisticasApi"; 

export default function ProductosChart() {
  const { periodo } = usePeriodo();

  const [datosOriginales, setDatosOriginales] = useState<any[][]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const productosPorPagina = 15;
  const [data, setData] = useState<any[][]>([]);

  useEffect(() => {
    fetchProductosMasVendidos(periodo)
      .then((res: any[][]) => {
        setDatosOriginales(res.slice(1)); // sin encabezado
        setPaginaActual(0); // Reiniciar página al cambiar período
      })
      .catch((err) =>
        console.error("Error cargando productos más vendidos:", err)
      );
  }, [periodo]);

  useEffect(() => {
    const encabezado = ["Producto", "Cantidad Vendida"];
    const cuerpo = datosOriginales.slice(
      paginaActual * productosPorPagina,
      (paginaActual + 1) * productosPorPagina
    );
    setData([encabezado, ...cuerpo]);
  }, [paginaActual, datosOriginales]);

  const totalPaginas = Math.ceil(datosOriginales.length / productosPorPagina);

  const options = {
    title: "50 Productos más vendidos",
    legend: { position: "none" },
    colors: ["#f44336"],
    hAxis: { slantedText: true },
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

      {totalPaginas > 1 && (
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
      )}
    </div>
  );
}
