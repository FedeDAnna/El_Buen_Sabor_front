import ProductosChart from './ProductosCharts';
import Rendimientos from './RendimientosCharts';
import RankingClientesCharts from './RankingClientesCharts';
import Selector from './SelectorPeriodo';
import { PeriodoProvider } from "./PeriodoContext";
import '../../estilos/Estadisticas/Dashboard.css';

export default function Dashboard() {
  return (
    <div>
      <h3>Reportes</h3>
      <h2>Rendimiento</h2>
      <PeriodoProvider>
      <Selector />
      <Rendimientos />
      <div className="dashboard-charts-row">
        <div className="chart-box">
          <ProductosChart />
        </div>
        <div className="chart-box">
          <RankingClientesCharts />
        </div>
      </div>
      </PeriodoProvider>
    </div>
  );
}