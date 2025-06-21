import { useMemo, useEffect } from "react";
import Pedido from "../../entidades/Pedido";
import { updateEstadoPedido, updateRepartidorPedido } from "../../services/FuncionesApi";
import { updateEstadoPedido, updateRepartidorPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import '../../estilos/OrdenFila.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { DateTime } from "luxon";


type Props = {
  pedido: Pedido;
  onSeleccionar: (pedido: Pedido) => void;
  onEstadoChange: () => void;
  onCobrar?: (pedido: Pedido) => void;
};

export default function OrdenFila({
  pedido,
  onSeleccionar,
  onEstadoChange,
  onCobrar
}: Props) {

  const usuarioJson = localStorage.getItem("usuario");
  const userRole = usuarioJson ? JSON.parse(usuarioJson).rol : "";

  if (userRole === "DELIVERY" && pedido.tipo_envio !== "DELIVERY") {
    return null;
  }
  
  const usuarioJson = localStorage.getItem("usuario");
  const userRole = usuarioJson ? JSON.parse(usuarioJson).rol : "";
  console.log("esteeeeeeee"+userRole);
  if (userRole === "DELIVERY" && pedido.tipo_envio !== "DELIVERY") {
    return null;
  }
  
  useEffect(() => {
    if (pedido.estado_pedido === Estado.EN_PREPARACION) {
      const now = DateTime.local();
      const estimated = pedido.hora_estimada_finalizacion;

      if (now > estimated) {
        updateEstadoPedido(pedido.id!, Estado.DEMORADO)
          .then(() => {
            onEstadoChange();
            Swal.fire({
              title: '¡Pedido demorado!',
              text: `El pedido #${pedido.id} ha superado la hora estimada de ${estimated.toFormat('HH:mm')}.`, 
              icon: 'info',
            });
          });
      }
    }

    const interval = setInterval(() => {
      if (pedido.estado_pedido === Estado.EN_PREPARACION) {
        const now = DateTime.local();
        const estimated = pedido.hora_estimada_finalizacion;

        if (now > estimated) {
          updateEstadoPedido(pedido.id!, Estado.DEMORADO)
            .then(() => {
              onEstadoChange();
              Swal.fire({
                title: '¡Pedido demorado!',
                text: `El pedido #${pedido.id} ha superado la hora estimada de ${estimated.toFormat('HH:mm')}.`, 
                icon: 'info',
              });
            });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [pedido, onEstadoChange]);
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
        if (pedido.tipo_envio === "DELIVERY") {
          return { nextEstado: Estado.EN_CAMINO, label: "En camino" };
        } else {
          return { nextEstado: null, label: "" }; // para TAKE_AWAY se cobra
        }
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
    // Antes de avanzar a EN_CAMINO, asigno repartidor
    if (nextEstado === Estado.EN_CAMINO) {
      await updateRepartidorPedido(pedido.id);
    }
    // Antes de avanzar a EN_CAMINO, asigno repartidor
    if (nextEstado === Estado.EN_CAMINO) {
      await updateRepartidorPedido(pedido.id);
    }
    await updateEstadoPedido(pedido.id, nextEstado);
    onEstadoChange();
  };

  const handleCancel = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!pedido.id) return;
    
  const result = await Swal.fire({
    title: '¿Seguro que querés cancelar el pedido?',
    text: "¡No vas a poder revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, mantener',
  });

  if (result.isConfirmed) {
    await updateEstadoPedido(pedido.id, Estado.RECHAZADO);
    onEstadoChange();
    await Swal.fire({
      title: '¡Pedido cancelado!',
      text: 'El pedido ha sido marcado como rechazado.',
      icon: 'success',
    });
  }
};
  
  return (
    <tr onClick={() => onSeleccionar(pedido)} style={{ cursor: "pointer" }}>
      <td>#{pedido.id}</td>
      <td>{pedido.usuario?.nombre} {pedido.usuario?.apellido}</td>
      <td>{pedido.fecha_pedido.toFormat("dd/LL/yyyy")}</td>
      <td>{pedido.tipo_envio}</td>
      <td>{pedido.hora_estimada_finalizacion.toFormat("HH:mm")}</td>
      {/* Estado con color según valor */}
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <div className={`estado-chip ${estadoClass}`}>
          {pedido.estado_pedido}
        </div>
      </td>
      <td>
        <div className="pedido-actions">
          {/* Avanzar estado si no es LISTO */}
          {(pedido.estado_pedido !== Estado.LISTO && nextEstado) && (
            <button onClick={handleNext}>{label}</button>
          )}

          {/* Si está LISTO y es TAKE_AWAY: Cobrar */}
          {onCobrar && pedido.estado_pedido === Estado.LISTO && pedido.tipo_envio === "TAKE_AWAY" && (
            <button
              onClick={e => {
                e.stopPropagation();
                onCobrar(pedido);
              }}
              className="primary"
            >
              Cobrar
            </button>
          )}

          {/* Si está LISTO y es DELIVERY: En camino */}
          {(pedido.estado_pedido === Estado.LISTO && pedido.tipo_envio === "DELIVERY") && (
            <button onClick={handleNext} className="primary">
              En camino
            </button>
          )}

          {/* Cancelar en todos menos RECHAZADO */}
          {pedido.estado_pedido !== Estado.RECHAZADO &&
            pedido.estado_pedido !== Estado.ENTREGADO&& (
            <button onClick={handleCancel} className="danger">
              Cancelar pedido
            </button>
          )}
        </div>

      </td>
    </tr>
  );
}