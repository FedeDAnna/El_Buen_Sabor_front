import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';
import { getPedidoPorId } from '../services/FuncionesApi';
import { generateInvoicePDF } from '../services/invoiceService';

interface InvoiceButtonProps {
  pedidoId: number;
}

export function InvoiceButton({ pedidoId }: InvoiceButtonProps) {
  const handleClick = async () => {
    try {
      const fullPedido = await getPedidoPorId(pedidoId);
      generateInvoicePDF(fullPedido);
    } catch (err) {
      console.error(err);
      alert('Error al generar la factura.');
    }
  };

  return (
    <button className="btn-generar-factura" onClick={handleClick}>
      <FaFileInvoice /> Generar Facturaaa
    </button>
  );
}