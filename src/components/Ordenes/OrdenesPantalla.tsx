import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import Pedido from "../../entidades/Pedido";
import { getPedidos, updateEstadoPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import "../../estilos/OrdenesPantalla.css";
import Paginacion from "../Ordenes/Paginado";
import TablaPedidos from "./OrdenesTabla";
import ModalOrden from "./OrdenModal";
import ModalPago from "./ModalPago";
import { FaBars } from "react-icons/fa";

const permisosPorRol: Record<string, (Estado | "")[]> = {
  admin: ["", Estado.PENDIENTE, Estado.CONFIRMADO, Estado.EN_PREPARACION, Estado.DEMORADO, Estado.LISTO, Estado.EN_CAMINO, Estado.ENTREGADO, Estado.RECHAZADO],
  cocinero: [Estado.CONFIRMADO, Estado.EN_PREPARACION, Estado.DEMORADO, Estado.LISTO, Estado.RECHAZADO],
  delivery: [Estado.LISTO, Estado.EN_CAMINO, Estado.ENTREGADO, Estado.RECHAZADO],
  cajero: ["", Estado.PENDIENTE, Estado.CONFIRMADO, Estado.EN_PREPARACION, Estado.DEMORADO, Estado.LISTO, Estado.EN_CAMINO, Estado.ENTREGADO, Estado.RECHAZADO],
};

const estadosDisponibles: { label: string; value: Estado | "" }[] = [
  { label: "Todos", value: "" },
  { label: "Pendiente", value: Estado.PENDIENTE },
  { label: "Confirmado", value: Estado.CONFIRMADO },
  { label: "En Preparación", value: Estado.EN_PREPARACION },
  { label: "Demorado", value: Estado.DEMORADO },
  { label: "Listo", value: Estado.LISTO },
  { label: "En Camino", value: Estado.EN_CAMINO },
  { label: "Entregado", value: Estado.ENTREGADO },
  { label: "Rechazado", value: Estado.RECHAZADO },
];

const EXCEPCIONES_FECHA: Estado[] = [Estado.ENTREGADO, Estado.RECHAZADO];
const hoyStr = new Date().toISOString().slice(0, 10);
const ELEMENTOS_POR_PAGINA = 8;

export default function OrdenesPantalla() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [pedidoPago, setPedidoPago] = useState<Pedido | null>(null);

  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const stompClient = useRef<Client | null>(null);

  const puedeCobrar = !(userRole === "cocinero" || userRole === "delivery");

  // === Inicializa usuario desde localStorage ===
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserRole(typeof u.rol === "string" ? u.rol.trim().toLowerCase() : "");
        setUserId(typeof u.id === "number" ? u.id : null);
      } catch {
        setUserRole("");
        setUserId(null);
      }
    }
  }, []);

  // === Carga inicial de pedidos ===
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  // === WebSocket Setup ===
  useEffect(() => {
    if (!userRole) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        // Empleados (no rol cliente) escuchan broadcast global
        if (userRole !== "cliente") {
          client.subscribe("/topic/pedidos", () => {
            cargarPedidos();
          });
        }
        // Cliente escucha su canal privado
        if (userRole === "cliente" && userId !== null) {
          client.subscribe(`/topic/pedidos/cliente/${userId}`, (msg: IMessage) => {
            const update = JSON.parse(msg.body) as { idPedido: number; estadoPedido: Estado };
            setPedidos(prev =>
              prev.map(p =>
                p.id === update.idPedido                  
                  ? ({ ...p, estado_pedido: update.estadoPedido } as Pedido)
                  : p
              )
            );
          });
        }
      },
      onStompError: frame => {
        console.error('STOMP error:', frame);
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
      stompClient.current = null;
    };
  }, [userRole, userId]);

  // === Filtrado y paginación ===
  const estadosVisibles = estadosDisponibles.filter(est => permisosPorRol[userRole]?.includes(est.value));
  const estadosAMostrar = estadosVisibles.filter(est => !(est.value === "" && (userRole === "cocinero" || userRole === "delivery")));

  const pedidosFiltrados = pedidos.filter(p => {
    const matchEstado = estadoSeleccionado === "" || p.estado_pedido === estadoSeleccionado;
    const necesitaFiltrarPorFecha = !EXCEPCIONES_FECHA.includes(estadoSeleccionado as Estado);
    const fechaPedido = typeof p.fecha_pedido === "string" ? p.fecha_pedido : p.fecha_pedido.toISODate();
    const matchFecha = necesitaFiltrarPorFecha ? fechaPedido === hoyStr : true;
    const termino = busqueda.toLowerCase();
    const nombre = `${p.usuario?.nombre ?? ""} ${p.usuario?.apellido ?? ""}`.toLowerCase();
    const matchNombre = nombre.includes(termino);
    const matchId = p.id?.toString().includes(termino);
    return matchEstado && matchFecha && (matchNombre || matchId);
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / ELEMENTOS_POR_PAGINA);
  const pedidosPaginados = pedidosFiltrados.slice((paginaActual - 1) * ELEMENTOS_POR_PAGINA, paginaActual * ELEMENTOS_POR_PAGINA);

  useEffect(() => { setPaginaActual(1); }, [estadoSeleccionado, busqueda]);

  // === Modals ===
  const abrirModalDetalles = (p: Pedido) => { setPedidoSeleccionado(p); setModalDetallesOpen(true); };
  const cerrarModalDetalles = () => { setModalDetallesOpen(false); setPedidoSeleccionado(null); };

  const abrirModalPago = (p: Pedido) => { setPedidoPago(p); setModalPagoOpen(true); };
  const cerrarModalPago = () => { setModalPagoOpen(false); setPedidoPago(null); };
  const handlePagoConfirmado = async () => {
    if (!pedidoPago?.id) return;
    await updateEstadoPedido(pedidoPago.id, Estado.ENTREGADO);
    cerrarModalPago();
    cargarPedidos();
  };

  return (
    <div className="ordenes-container">
      <div className="ordenes-header">
        <h2>📋 Pedidos</h2>
        <div className="buscador-contenedor">
          <div className="buscador">
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="barra-superior">
        <div className="filtros">
          {estadosAMostrar.map(est => (
            <button
              key={String(est.value)}
              onClick={() => setEstadoSeleccionado(est.value)}
              className={estadoSeleccionado === est.value ? "activo" : ""}
            >
              {est.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tabla-wrapper">
        {pedidosPaginados.length > 0 ? (
          <TablaPedidos
            pedidos={pedidosPaginados}
            onSeleccionar={abrirModalDetalles}
            onEstadoChange={cargarPedidos}
            {...(puedeCobrar && { onCobrar: abrirModalPago })}
          />
        ) : (
          <p className="vacio">No se encontraron órdenes.</p>
        )}
      </div>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPaginaCambio={setPaginaActual}
      />

      {modalDetallesOpen && pedidoSeleccionado && (
        <ModalOrden
          pedido={pedidoSeleccionado}
          onClose={cerrarModalDetalles}
          onEstadoChange={cargarPedidos}
          onCobrar={abrirModalPago}
        />
      )}

      {modalPagoOpen && pedidoPago && (
        <ModalPago
          pedido={pedidoPago}
          onClose={cerrarModalPago}
          onPaid={handlePagoConfirmado}
        />
      )}
    </div>
  );
}
