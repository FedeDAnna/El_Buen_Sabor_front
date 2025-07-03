// src/components/HistorialPedidos.tsx
import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import { fetchHistorialPedidosClientes } from '../../services/FuncionesApi';
import HistorialPedidoCard from './HistorialPedidoCard';
import type { PedidoHistorialDTO } from '../../DTOs/DTO/PedidoHistorialDTO';
import '../../estilos/HistorialPedidosCliente.css';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState<PedidoHistorialDTO[]>([]);
  const [pagina, setPagina] = useState(0);
  const usuarioJSON = localStorage.getItem('usuario')!;
  const usuario = JSON.parse(usuarioJSON);
  const idUsuario: number = usuario.id;

  const stompClient = useRef<Client | null>(null);

  // función para recargar los datos
  const recargar = () => {
    fetchHistorialPedidosClientes(pagina, idUsuario)
      .then(data => setPedidos(data));
  };

  // fetch inicial y cuando cambia página
  useEffect(() => {
    recargar();
  }, [pagina]);

  // setup WebSocket para reenviar cambios al cliente
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        // suscribirse al canal privado del cliente
        client.subscribe(`/topic/pedidos/cliente/${idUsuario}`, (msg: IMessage) => {
          // cada vez que llega un update, recargamos la página actual
          recargar();
        });
      },
      onStompError: frame => {
        console.error('STOMP error in HistorialPedidos:', frame);
      }
    });
    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
      stompClient.current = null;
    };
  }, [idUsuario, pagina]);

  return (
    <div className="contenedor-historial">
      <h2 className="titulo-historial">Mis órdenes</h2>
      <div className="grilla-pedidos">
        {pedidos.map(p => (
          <HistorialPedidoCard key={p.id} pedido={p} />
        ))}
      </div>
      <div className="paginacion">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i)}
            className={`btn-pagina ${pagina === i ? 'pagina-activa' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
