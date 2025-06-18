import { useState } from "react";
import Pedido from "../../entidades/Pedido";
import ModalOrden from "./OrdenModal"; // Asegurate de importar tu modal
import OrdenFila from "./OrdenFila";
import '../../estilos/OrdenesTabla.css';

type Props = {
  pedidos: Pedido[];
  onSeleccionar: (pedido: Pedido) => void;
  onEstadoChange: () => void;
  onCobrar: (p: Pedido) => void; 
};

function TablaPedidos({ pedidos , onSeleccionar, onEstadoChange,onCobrar}: Props) {
  
  

  return (
    <>
      <table>
      <thead>
        <tr>
          <th>ORDEN</th>
          <th>CLIENTE</th>
          <th>FECHA</th>
          <th>TIPO DE ENVIO</th>
          <th>HORA ESTIMADA</th>
          <th>ESTADO</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((pedido) => (
          <OrdenFila key={pedido.id} pedido={pedido} onSeleccionar={onSeleccionar} onEstadoChange={onEstadoChange} onCobrar={onCobrar} />
        ))}
      </tbody>
    </table>

      
    </>
  );
}

export default TablaPedidos;
