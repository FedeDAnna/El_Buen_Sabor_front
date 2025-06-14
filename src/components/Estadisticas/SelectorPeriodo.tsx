import { usePeriodo } from "./PeriodoContext";
import "../../estilos/Estadisticas/SelectorPeriodo.css";

export default function SelectorPeriodo() {
  const { periodo, setPeriodo } = usePeriodo();

  return (
    <div className="selector-periodo-container">
      <label htmlFor="selector-periodo">Seleccionar Período:</label>
      <select
        id="selector-periodo"
        className="selector-periodo"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value as "1" | "2" | "3")}
      >
        <option value="1">Día</option>
        <option value="2">Semana</option>
        <option value="3">Mes</option>
      </select>
    </div>
  );
}
