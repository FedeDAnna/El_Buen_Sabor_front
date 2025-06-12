import { useState } from "react";
import Pedido from "../../entidades/Pedido";
import OrdenModal from "./OrdenModal";

type Props = {
  pedido: Pedido;
  onSeleccionar: (pedido: Pedido) => void;
};

function OrdenFila({ pedido, onSeleccionar }: Props) {
  

  return (
    <>
      <tr onClick={() => onSeleccionar(pedido)} style={{ cursor: "pointer" }}>
      <td>#{pedido.id}</td>
      <td>{pedido.usuario?.nombre} {pedido.usuario?.apellido}</td>
      <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
      <td>{pedido.hora_estimada_finalizacion}</td>
      <td>{pedido.estado_pedido}</td>
      <td>👁️</td>
    </tr>
    </>
  );
}

export default OrdenFila;
