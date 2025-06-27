// src/components/Estadisticas/Dashboard.tsx
import React from "react";
import ProductosChart from './ProductosCharts';
import Rendimientos from './RendimientosCharts';
import RankingClientesCharts from './RankingClientesCharts';
import Selector from './SelectorPeriodo';
import { PeriodoProvider, usePeriodo } from "./PeriodoContext";
import '../../estilos/Estadisticas/Dashboard.css';
import { exportarExcel } from "../../services/EstadisticasApi";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Reportes</h1>
      <h2>Rendimiento</h2>
      <PeriodoProvider>
        <InnerDashboard />
      </PeriodoProvider>
    </div>
  );
}

function InnerDashboard() {
  const { periodo } = usePeriodo();

  const handleDownloadExcel = async () => {
    try {
      const blob = await exportarExcel(periodo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Estadisticas_${periodo}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('No se pudo descargar el archivo. Intenta nuevamente.');
    }
  };

  return (
    <>
      <div className="dashboard-container-selector">
        <Selector />
        <button className="btn-excel" onClick={handleDownloadExcel}>
          Descargar Excel
        </button>
      </div>
      <Rendimientos />
      <div className="dashboard-charts-row">
        <div className="chart-box">
          <ProductosChart />
        </div>
        <div className="chart-box">
          <RankingClientesCharts />
        </div>
      </div>
    </>
  );
}