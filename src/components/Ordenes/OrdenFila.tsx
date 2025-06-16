import { useMemo } from "react";
import Pedido from "../../entidades/Pedido";
import { updateEstadoPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import '../../estilos/OrdenFila.css';

type Props = {
  pedido: Pedido;
  onSeleccionar: (pedido: Pedido) => void;
  onEstadoChange: () => void;
  onCobrar: (pedido: Pedido) => void; 
};

export default function OrdenFila({
  pedido,
  onSeleccionar,
  onEstadoChange,
  onCobrar
}: Props) {
  // Determina siguiente estado y etiqueta
  const { nextEstado, label } = useMemo(() => {
    switch (pedido.estado_pedido) {
      case Estado.PENDIENTE:
        return { nextEstado: Estado.CONFIRMADO, label: "Confirmar" };
      case Estado.CONFIRMADO:
        return { nextEstado: Estado.EN_PREPARACION, label: "Preparar" };
      case Estado.EN_PREPARACION:
        return { nextEstado: Estado.LISTO, label: "Listo" };
      case Estado.DEMORADO:
        return { nextEstado: Estado.LISTO, label: "Listo" };
      case Estado.LISTO:
        return { nextEstado: null, label: "" };
      case Estado.EN_CAMINO:
        return { nextEstado: Estado.ENTREGADO, label: "Entregado" };
      default:
        return { nextEstado: null, label: "" };
    }
  }, [pedido.estado_pedido, pedido.tipo_envio]);

  // Mapea cada estado a un color
  const estadoClass = useMemo(() => {
  switch (pedido.estado_pedido) {
    case Estado.PENDIENTE:       return "estado-pendiente";
    case Estado.CONFIRMADO:      return "estado-confirmado";
    case Estado.EN_PREPARACION:  return "estado-preparacion";
    case Estado.DEMORADO:        return "estado-demorado";
    case Estado.LISTO:           return "estado-listo";
    case Estado.EN_CAMINO:       return "estado-encamino";
    case Estado.ENTREGADO:       return "estado-entregado";
    case Estado.RECHAZADO:       return "estado-rechazado";
    default:                     return "";
  }
}, [pedido.estado_pedido]);

  const handleNext = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pedido.id || nextEstado === null) return;
    await updateEstadoPedido(pedido.id, nextEstado);
    onEstadoChange();
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Seguro que querés cancelar?")) return;
    if (!pedido.id) return;
    await updateEstadoPedido(pedido.id, Estado.RECHAZADO);
    onEstadoChange();
  };

  return (
    <tr onClick={() => onSeleccionar(pedido)} style={{ cursor: "pointer" }}>
      <td>#{pedido.id}</td>
      <td>{pedido.usuario?.nombre} {pedido.usuario?.apellido}</td>
      <td>{pedido.fecha_pedido.toFormat("dd/LL/yyyy")}</td>
      <td>{pedido.hora_estimada_finalizacion.toFormat("HH:mm")}</td>
      {/* Estado con color según valor */}
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <div className={`estado-chip ${estadoClass}`}>
          {pedido.estado_pedido}
        </div>
      </td>
      <td>
        <div className="pedido-actions">
          {/* Avanzar estado */}
          {nextEstado && (
            <button onClick={handleNext}>{label}</button>
          )}
          {/* Cobrar si está LISTO */}
          {pedido.estado_pedido === Estado.LISTO && (() => {
            if (pedido.tipo_envio === "TAKE_AWAY") {
              return (
                <button
                  onClick={e => { e.stopPropagation(); onCobrar(pedido); }}
                  className="primary"
                >
                  Cobrar
                </button>
              );
            }
            return (
              <button onClick={handleNext} >
                En Camino
              </button>
            );
          })()}
          {/* Cancelar en todos menos RECHAZADO */}
          {pedido.estado_pedido !== Estado.RECHAZADO && (
            <button onClick={handleCancel} className="danger">
              Cancelar pedido
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
