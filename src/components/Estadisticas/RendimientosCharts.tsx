import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaShoppingBag, FaDollarSign, FaHandHoldingUsd, FaUserPlus } from "react-icons/fa";
import "../../estilos/Estadisticas/Rendimientos.css"; 
import { usePeriodo } from "./PeriodoContext"; 

export default function Rendimientos() {
  const { periodo } = usePeriodo(); 
  const [stats, setStats] = useState({
    ventas: 0,
    ingresos: 0,
    costos: 0,
    nuevosClientes: 0,
  });

  useEffect(() => {
    fetch(`/api/stats?periodo=${periodo}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));
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
        <Card icon={<FaUserPlus size={24} />} label="NUEVOS CLIENTES" value={stats.nuevosClientes} />
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
