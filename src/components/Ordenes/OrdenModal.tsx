// src/components/ModalOrden.tsx
import React, { useMemo, useState } from "react";
import Pedido from "../../entidades/Pedido";
import { updateEstadoPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import "../../estilos/ModalOrden.css";
import type ArticuloInsumo from "../../entidades/ArticuloInsumo";
import type ArticuloManufacturado from "../../entidades/ArticuloManufacturado";
import type Articulo from "../../entidades/Articulo";
import type PedidoDetalle from "../../entidades/PedidoDetalle";
import { InvoiceButton } from "../InvoiceButton";

function isInsumo(a: Articulo): a is ArticuloInsumo {
  return 'stock_insumo_sucursales' in a;
}

function isManufacturado(a: Articulo): a is ArticuloManufacturado {
  return 'detalles' in a;
}
type Props = {
  pedido: Pedido;
  onClose: () => void;
  onEstadoChange: () => void;
  onCobrar: (pedido: Pedido) => void; 
};

export default function ModalOrden({ pedido, onClose, onEstadoChange,onCobrar }: Props) {
  console.log("pedido",pedido);
  const [pestañaActiva, setPestañaActiva] = useState<
    "detalles" | "productos" | "factura"
  >("detalles");
  const [loading, setLoading] = useState(false);
  const [facturaUrl, setFacturaUrl] = useState<string | null>(null);

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
                    <th>Preparación</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
               <tbody>
                {pedido.detalles.map((det, i) => {
                  const art = det.articulo;
                  if (!art) return null; // si por alguna razón viene sin artículo
                  return (
                    <tr key={i}>
                      <td>{art.denominacion}</td>
                      <td>
                        {isManufacturado(art)
                          ? art.preparacion         // si es manufacturado, muestro preparación
                          : "No tiene preparación" // si es insumo (o cualquier otro), muestro mensaje
                        }
                      </td>
                      <td>{det.cantidad}</td>
                      <td>${det.subtotal}</td>
                    </tr>
                  );
                })}
              </tbody>



              </table>
            </section>
          )}

          {pestañaActiva === "factura" && (
            <section className="seccion factura-section">
              <h2>Factura - Orden #{pedido.id}</h2>

              <div className="factura-header">
                <div className="factura-info-left">
                  <p>Fecha: {new Date(pedido.fecha_pedido.toJSDate()).toLocaleDateString()}</p>
                  <p>Cliente: {pedido.usuario?.nombre} {pedido.usuario?.apellido}</p>
                  <p>Forma de Pago: {pedido.forma_pago}</p>
                </div>
                <div className="factura-info-right">
                  <p>Hora Estimada: {pedido.hora_estimada_finalizacion.toFormat("HH:mm:ss")}</p>
                  <p>Tipo de Envío: {pedido.tipo_envio}</p>
                </div>
              </div>

              <table className="factura-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.detalles.map((det: PedidoDetalle, i: number) => {
                    const art = det.articulo;
                    if (!art) return null;
                    const precioUnit = det.subtotal / det.cantidad;
                    return (
                      <tr key={i}>
                        <td>{art.denominacion}</td>
                        <td>{det.cantidad}</td>
                        <td>${precioUnit.toFixed(2)}</td>
                        <td>${det.subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <p className="factura-total">Total: ${pedido.total.toFixed(2)}</p>

              {pedido.id != null && (
                <InvoiceButton pedidoId={pedido.id} />
              )}
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
