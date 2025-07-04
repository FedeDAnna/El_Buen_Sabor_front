// src/components/ModalPago.tsx
import React, { useState, useEffect } from "react";
import Pedido from "../../entidades/Pedido";
import "../../estilos/ModalOrden.css";
import { getProductosPorPedido } from "../../services/FuncionesApi";

type Props = {
  pedido: Pedido;
  onClose: () => void;
  onPaid: (paidAmount: number) => void;  
};

export default function ModalPago({ pedido, onClose, onPaid }: Props) {
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState<string>("");
  const [calculatedChange, setCalculatedChange] = useState<number>(0);

  const total = pedido.total ?? 0;
  const paid = parseFloat(received) || 0;

  const handleCalculate = () => {
    setCalculatedChange(paid - total);
  };

  const handlePay = async () => {
    if (paid < total) return;
    setLoading(true);
    await onPaid(paid);
    onClose();
  };

  const [detalles, setDetalles] = useState<any[]>([]);

  useEffect(() => {
  const fetchDetalles = async () => {
    if (pedido.id == null) return; 

    try {
      const data = await getProductosPorPedido(pedido.id);
      setDetalles(data);
    } catch (error) {
      console.error("Error al cargar los detalles del pedido:", error);
    }
  };

  fetchDetalles();
}, [pedido.id]);



  return (
     <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>💰 Cobrar Orden #{pedido.id}</h2>
          <button className="cerrar" onClick={onClose}>X</button>
        </div>

        {/* Body scrollable */}
        <div className="tab-contenido">
          {/* Cliente */}
          <section className="seccion">
            <h3>👤 Cliente</h3>
            <table>
              <tbody>
                <tr>
                  <th>Nombre</th><th>Email</th><th>Teléfono</th>
                </tr>
                <tr>
                  <td>
                    {pedido.usuario
                      ? `${pedido.usuario.nombre} ${pedido.usuario.apellido}`
                      : "—"}
                  </td>
                  <td>{pedido.usuario?.email ?? "—"}</td>
                  <td>{pedido.usuario?.telefono ?? "—"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Productos */}
          <section className="seccion">
            <h3>🛒 Productos</h3>
            <table>
              <thead>
                <tr>
                  <th>Artículo</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.detalles.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.articulo?.denominacion}</td>
                      <td>{prod.cantidad}</td>
                      <td>${prod.articulo?.precio_venta}</td>
                      <td>${prod.subtotal}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

           {/* Sección de Pago */}
           <section className="seccion pago-section">
             <h3>💵 Pago</h3>
             <div className="pago-form">
               
               <div className="cont-pago">
                 <div className="recibido">
                   <label>Recibido:</label>
                   <input
                     type="number"
                     min="0"
                     step="0.01"
                     value={received}
                     onChange={e => setReceived(e.target.value)}
                     style={{ width: "100px", padding: "0.25rem" }}
                   />
                 </div>
                 <div className="pago-calcular">
                   <button
                      className="btn-calcular"
                     onClick={handleCalculate}
                     disabled={received === "" || loading}
                   >
                     Calcular vuelto
                   </button>
                 </div>
               </div>
               <div className="vuelto">
                 <label>Vuelto:</label>
                 <div>
                   <strong style={{ color: calculatedChange < 0 ? "#e74c3c" : "#2ecc71" }}>
                     ${calculatedChange.toFixed(2)}
                   </strong>
                 </div>
               </div>
             </div>
             {/* </div> */}
             {/* Total destacado abajo a la derecha */}
             
             <div className="payment-total">
                <table className="tabla_payment">
                  <tbody>
                    <tr>
                      <th>Subtotal:</th>
                      <td>${(pedido.total + pedido.descuento!).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Descuento:</th>
                      <td>−${pedido.descuento!.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Total:</th>
                      <td>${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

              
             </div>
            </section>
          {/* </section> */}
        </div>

        {/* Footer con acción */}
        <div className="modal-footer">
          <button onClick={handlePay} disabled={loading || paid < total}>
            Cobrar 
          </button>
          <button className="danger" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
