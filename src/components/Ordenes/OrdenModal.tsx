import React, { useState } from "react";
import Pedido from "../../entidades/Pedido";
import "../../estilos/ModalOrden.css"; // Asegurate de tener estilos similares a los de la imagen

type Props = {
  pedido: Pedido;
  onClose: () => void;
};

const ModalOrden = ({ pedido, onClose }: Props) => {
  const [pestañaActiva, setPestañaActiva] = useState("detalles");

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>🧾 ORDEN #{pedido.id}</h2>
          <button className="cerrar" onClick={onClose}>X</button>
        </div>

        {/* Navegación */}
        <div className="tabs">
          <button onClick={() => setPestañaActiva("detalles")} className={pestañaActiva === "detalles" ? "activo" : ""}>Detalles</button>
          <button onClick={() => setPestañaActiva("productos")} className={pestañaActiva === "productos" ? "activo" : ""}>Productos</button>
          <button onClick={() => setPestañaActiva("factura")} className={pestañaActiva === "factura" ? "activo" : ""}>Factura</button>
        </div>

        {/* Contenido por pestaña */}
        <div className="tab-contenido">
          {pestañaActiva === "detalles" && (
            <>
              <section className="seccion">
                <h3>👤 Cliente</h3>
                <div className="fila">
                  <span><strong>Nombre:</strong> {pedido.usuario?.nombre}</span>
                  <span><strong>Email:</strong> {pedido.usuario?.email}</span>
                  <span><strong>Teléfono:</strong> {pedido.usuario?.telefono}</span>
                </div>
              </section>

              <section className="seccion">
                <h3>🚚 Envío</h3>
                <div className="fila">
                  <span><strong>Dirección:</strong> {pedido.domicilio?.calle} {pedido.domicilio?.numero}, {pedido.domicilio?.localidad?.nombre}, {pedido.domicilio?.localidad?.provincia?.nombre}, {pedido.domicilio?.localidad?.provincia?.pais?.nombre}</span>
                  <span><strong>Nombre:</strong> {pedido.usuario?.nombre}</span>
                  <span><strong>Teléfono:</strong> {pedido.usuario?.telefono}</span>
                  <span><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString()}</span>
                </div>
              </section>

              <section className="seccion">
                <h3>📌 Estado</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th>Actualizado el</th>
                      <th>Actualizado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {pedido.historial_estado?.map((estado, index) => (
                      <tr key={index}>
                        <td>{estado.nombre}</td>
                        <td>{new Date(estado.fecha).toLocaleString()}</td>
                        <td>{estado.actualizado_por}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </section>

              <section className="seccion">
                <h3>💳 Pago</h3>
                <div className="fila">
                  <span><strong>Transacción:</strong> {pedido.id}</span>
                  <span><strong>Método de pago:</strong> {pedido.forma_pago}</span>
                  <span><strong>Monto:</strong> ${pedido.total}</span>
                  <span><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString()}</span>
                </div>
              </section>
            </>
          )}

          {pestañaActiva === "productos" && (
            <section className="seccion">
              <h3>🛒 Productos</h3>
              <ul>
                {pedido.detalles.map((prod, i) => (
                  <li key={i}>
                    {prod.articulo?.denominacion} - Cantidad: {prod.cantidad} - ${prod.subtotal}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {pestañaActiva === "factura" && (
            <section className="seccion">
              <h3>📄 Factura</h3>
              <p>Contenido de la factura (pendiente de implementación)</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalOrden;
