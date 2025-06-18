// src/components/HistorialPedidoCard.tsx
import { FaClock, FaFileInvoice } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import type { PedidoHistorialDTO } from '../../DTOs/DTO/PedidoHistorialDTO';
import { Estado } from '../../entidades/Estado';
import '../../estilos/HistorialPedidosCliente.css';
import { getPedidoPorId } from '../../services/FuncionesApi';
import { DateTime } from 'luxon';
import type Pedido from '../../entidades/Pedido';
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
      {pedido.estado === Estado.ENTREGADO && (
        <div className="card-actions">
        <InvoiceButton pedidoId={pedido.id} />
      </div>
      )}
    </div>
  );
}
