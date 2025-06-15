import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaShoppingBag, FaDollarSign, FaHandHoldingUsd, FaUserPlus } from "react-icons/fa";
import "../../estilos/Estadisticas/Rendimientos.css"; 
import { usePeriodo } from "./PeriodoContext"; 
import { fetchRendimientos } from "../../services/EstadisticasApi"; 
import type { RendimientoChartProjectionDTO } from "../../DTOs/ProjectionsDTO/RendimientoChartProjectionDTOImpl";

export default function Rendimientos() {
  const { periodo } = usePeriodo(); 
  const [stats, setStats] = useState<RendimientoChartProjectionDTO>({
  ventas: 0,
  ingresos: 0,
  costos: 0,
  nuevosClientes: 0,
});

  useEffect(() => {
     fetchRendimientos(periodo)
      .then(setStats)      
      .catch(e => console.log(e.message))
  }, [periodo]);

  return (
    <div className="rendimiento-container">
      <div className="rendimiento-header">
        <h2>RENDIMIENTO</h2>
      </div>

      <div className="rendimiento-cards">
        <Card icon={<FaShoppingBag size={24} />} label="VENTAS" value={stats.ventas} />
        <Card icon={<FaDollarSign size={24} />} label="INGRESOS" value={`$${stats.ingresos}`} />
        <Card icon={<FaHandHoldingUsd size={24} />} label="COSTOS" value={`$${stats.costos}`} />
        <Card icon={<FaUserPlus size={24} />} label="CLIENTE TOTALES" value={stats.nuevosClientes} />
      </div>
    </div>
  );
}

function Card({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rendimiento-card">
      <div className="rendimiento-icon">{icon}</div>
      <div className="rendimiento-info">
        <div className="rendimiento-label">{label}</div>
        <div className="rendimiento-value">{value}</div>
      </div>
    </div>
  );
}
