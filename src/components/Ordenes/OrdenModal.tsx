// src/components/ModalOrden.tsx
import React, { useMemo, useState } from "react";
import Pedido from "../../entidades/Pedido";
import { updateEstadoPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import "../../estilos/ModalOrden.css";

type Props = {
  pedido: Pedido;
  onClose: () => void;
  onEstadoChange: () => void;
  onCobrar: (pedido: Pedido) => void; 
};

export default function ModalOrden({ pedido, onClose, onEstadoChange,onCobrar }: Props) {
  const [pestañaActiva, setPestañaActiva] = useState<
    "detalles" | "productos" | "factura"
  >("detalles");
  const [loading, setLoading] = useState(false);

  // Determina siguiente estado y etiqueta de botón
  const { nextEstado, label } = useMemo(() => {
    switch (pedido.estado_pedido) {
      case Estado.PENDIENTE:
        return { nextEstado: Estado.CONFIRMADO, label: "Confirmar" };
      case Estado.CONFIRMADO:
        return { nextEstado: Estado.EN_PREPARACION, label: "Preparar" };
      case Estado.EN_PREPARACION:
        return { nextEstado: Estado.LISTO, label: "Listo" };
      case Estado.LISTO:
        return pedido.tipo_envio === "DELIVERY"
          ? { nextEstado: Estado.EN_CAMINO, label: "En camino" }
          : { nextEstado: null, label: "" };
      case Estado.EN_CAMINO:
        return { nextEstado: Estado.ENTREGADO, label: "Entregado" };
      default:
        return { nextEstado: null, label: "" };
    }
  }, [pedido.estado_pedido, pedido.tipo_envio]);

  const handleNext = async () => {
    if (!pedido.id || nextEstado == null) return;
    setLoading(true);
    await updateEstadoPedido(pedido.id, nextEstado);
    onEstadoChange();
    onClose();
  };

  // const handleCancel = async () => {
  //   if (pedido.estado_pedido === Estado.RECHAZADO) return;
  //   const ok = window.confirm(
  //     "¿Seguro que deseas cancelar este pedido? Esto lo marcará como rechazado."
  //   );
  //   if (!ok || !pedido.id) return;
  //   setLoading(true);
  //   await updateEstadoPedido(pedido.id, Estado.RECHAZADO);
  //   onEstadoChange();
  //   onClose();
  // };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>🧾 ORDEN #{pedido.id}</h2>
          <button className="cerrar" onClick={onClose}>X</button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={pestañaActiva === "detalles" ? "activo" : ""}
            onClick={() => setPestañaActiva("detalles")}
          >
            Detalles
          </button>
          <button
            className={pestañaActiva === "productos" ? "activo" : ""}
            onClick={() => setPestañaActiva("productos")}
          >
            Productos
          </button>
          <button
            className={pestañaActiva === "factura" ? "activo" : ""}
            onClick={() => setPestañaActiva("factura")}
          >
            Factura
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-contenido">
          {pestañaActiva === "detalles" && (
            <>
              {/* Cliente */}
              <section className="seccion">
                <h3>👤 Cliente</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                    <tr>
                      <td>
                        {pedido.usuario?.nombre} {pedido.usuario?.apellido}
                      </td>
                      <td>{pedido.usuario?.email}</td>
                      <td>{pedido.usuario?.telefono}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* Envío */}
              <section className="seccion">
                <h3>🚚 Envío {pedido.tipo_envio}</h3>
                {pedido.tipo_envio === "DELIVERY" ? (
                  <table className="modalTable">
                    <thead>
                      <tr>
                        <th>Dirección</th>
                        <th>Repartidor</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {`${pedido.domicilio?.calle} ${pedido.domicilio?.numero}, ${pedido.domicilio?.localidad?.nombre}, ${pedido.domicilio?.localidad?.provincia?.nombre}, ${pedido.domicilio?.localidad?.provincia?.pais?.nombre}`}
                        </td>
                        <td>
                          {pedido.repartidor?.nombre}{" "}
                          {pedido.repartidor?.apellido}
                        </td>
                        <td>{pedido.repartidor?.telefono}</td>
                        <td>{pedido.fecha_pedido.toFormat("dd/LL/yyyy")}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p>Retiro por el local</p>
                )}
              </section>

              

              {/* Pago */}
              <section className="seccion">
                <h3>💳 Pago</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>Transacción</th>
                      <th>Método de pago</th>
                      <th>Fecha</th>
                      <th>Monto</th>
                    </tr>
                    <tr>
                      <td>{pedido.id}</td>
                      <td>{pedido.forma_pago}</td>
                      <td>
                        {new Date(pedido.fecha_pedido.toJSDate()).toLocaleDateString()}
                      </td>
                      <td>${pedido.total}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )}

          {pestañaActiva === "productos" && (
            <section className="seccion">
              <h3>🛒 Productos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Artículo</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.detalles.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.articulo?.denominacion}</td>
                      <td>{prod.cantidad}</td>
                      <td>${prod.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {pestañaActiva === "factura" && (
            <section className="seccion">
              <h3>📄 Factura</h3>
              <table>
                <thead>
                  <tr>
                    <th>Detalle</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Factura pendiente</td>
                    <td>–</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="modal-footer">
          <div>
            {nextEstado && (
              <button disabled={loading} onClick={handleNext}>
                {label}
              </button>
            )}
            {/* Si está LISTO y es TAKE_AWAY: Cobrar */}
          {(pedido.estado_pedido === Estado.LISTO && pedido.tipo_envio === "TAKE_AWAY") && (
            <button
              onClick={e => {
                onClose();
                e.stopPropagation();
                onCobrar(pedido);
              }}
              className="primary"
            >
              Cobrar
            </button>
          )}
            {pedido.estado_pedido !== Estado.RECHAZADO && (
              <button disabled={loading} className="danger" onClick={onClose}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
