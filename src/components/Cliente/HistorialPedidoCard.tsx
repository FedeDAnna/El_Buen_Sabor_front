// src/components/HistorialPedidoCard.tsx
import React from 'react';
import { FaClock, FaFileInvoice, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import type { PedidoHistorialDTO } from '../../DTOs/DTO/PedidoHistorialDTO';
import { Estado } from '../../entidades/Estado';
import '../../estilos/HistorialPedidosCliente.css';
import { InvoiceButton } from '../InvoiceButton';

interface Props {
  pedido: PedidoHistorialDTO;
}

const estadoColor: Record<Estado, string> = {
  [Estado.PENDIENTE]: 'estado-pendiente',
  [Estado.CONFIRMADO]: 'estado-confirmado',
  [Estado.EN_PREPARACION]: 'estado-preparacion',
  [Estado.DEMORADO]: 'estado-demorado',
  [Estado.LISTO]: 'estado-listo',
  [Estado.RECHAZADO]: 'estado-rechazado',
  [Estado.EN_CAMINO]: 'estado-encamino',
  [Estado.ENTREGADO]: 'estado-entregado',
};

export default function HistorialPedidoCard({ pedido }: Props) {
  const esFinalizado =
    pedido.estado === Estado.ENTREGADO ||
    pedido.estado === Estado.RECHAZADO;

  return (
    <div className="card-pedido">
      <div className="card-header">
        <h3 className="card-title">Orden #{pedido.id}</h3>
        <span className={`estado ${estadoColor[pedido.estado] || 'estado-default'}`}>
          {pedido.estado}
        </span>
      </div>

      <div className="card-time">
        <FaClock className="icono-reloj" />
        <span className="hora">{pedido.hora}</span>
      </div>

      <div className="card-fecha">{pedido.fecha}</div>

      <ul className="card-productos">
        {pedido.productos.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>

      <div className="card-actions">
        {/* Si no está finalizado, muestro spinner */}
        {!esFinalizado && (
          <div className="loader">
            <FaSpinner className="spin" /> En Proceso...
          </div>
        )}
        {/* Si está entregado, muestro botón de factura */}
        {pedido.estado === Estado.ENTREGADO && (
          <InvoiceButton pedidoId={pedido.id} />
        )}
      </div>
    </div>
  );
}
