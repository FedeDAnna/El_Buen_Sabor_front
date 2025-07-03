// invoiceService.ts
import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import { DateTime } from 'luxon';
import type Pedido from '../entidades/Pedido';

export function generateInvoicePDF(fullPedido: Pedido) {
  const doc = new jsPDF({ unit: 'pt' });

  // --- Encabezado ---
  doc.setFontSize(18);
  doc.text(`Factura - Orden #${fullPedido.id}`, 40, 50);

  doc.setFontSize(12);
  const fecha = fullPedido.fecha_pedido.toFormat('dd/LL/yyyy');
  doc.text(`Fecha: ${fecha}`, 40, 80);

  // Datos adicionales
  const clienteNombre = `${fullPedido.usuario?.nombre ?? ''} ${fullPedido.usuario?.apellido ?? ''}`.trim();
  doc.text(`Cliente: ${clienteNombre}`, 300, 80);
  doc.text(`Forma de Pago: ${fullPedido.forma_pago ?? ''}`, 40, 120);
  doc.text(`Tipo de Envío: ${fullPedido.tipo_envio ?? ''}`, 300, 120);

  // --- Tabla de detalles ---
  const columns = ['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'];
  const rows: RowInput[] = fullPedido.detalles.map(det => [
    det.articulo?.denominacion ?? '',
    det.cantidad != null ? det.cantidad.toString() : '0',
    det.articulo?.precio_venta != null ? det.articulo.precio_venta.toFixed(2) : '0.00',
    det.subtotal != null ? `$${det.subtotal.toFixed(2)}` : '$0.00',
  ]);

  autoTable(doc, {
    startY: 140,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
  });

  // --- Total al final ---
  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.setFontSize(14);
  doc.text(`Total: $${fullPedido.total.toFixed(2)}`, 40, finalY + 30);

  // Descargar
  doc.save(`Factura_Orden_${fullPedido.id}.pdf`);
}
