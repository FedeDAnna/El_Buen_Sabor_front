// src/components/OrdenesPantalla.tsx
import React, { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import { getPedidos, updateEstadoPedido } from "../../services/FuncionesApi";
import { Estado } from "../../entidades/Estado";
import "../../estilos/OrdenesPantalla.css";
import Paginacion from "../Ordenes/Paginado";
import TablaPedidos from "./OrdenesTabla";
import ModalOrden from "./OrdenModal";
import ModalPago from "./ModalPago";
import { FaBars } from "react-icons/fa";

// 1) Map de estados permitidos por rol
const permisosPorRol: Record<string, (Estado | "")[]> = {
  admin: [
    "", Estado.PENDIENTE, Estado.CONFIRMADO,
    Estado.EN_PREPARACION, Estado.DEMORADO,
    Estado.LISTO, Estado.EN_CAMINO,
    Estado.ENTREGADO, Estado.RECHAZADO
  ],
  cocinero: [
    Estado.CONFIRMADO, Estado.EN_PREPARACION,
    Estado.DEMORADO, Estado.LISTO, Estado.RECHAZADO
  ],
  delivery: [
    Estado.LISTO,
    Estado.EN_CAMINO, Estado.ENTREGADO, Estado.RECHAZADO
  ],
  cajero: [
    "", Estado.PENDIENTE, Estado.CONFIRMADO,
    Estado.EN_PREPARACION, Estado.DEMORADO,
    Estado.LISTO, Estado.EN_CAMINO,
    Estado.ENTREGADO, Estado.RECHAZADO
  ]
};

// 1) Incluimos "Todos" con value vacío
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

// Estados que NO se filtran por fecha (traen todos sus registros)
const EXCEPCIONES_FECHA: Estado[] = [
  Estado.ENTREGADO,
  Estado.RECHAZADO,
];

// Cadena con la fecha de hoy en formato YYYY-MM-DD
const hoyStr = new Date().toISOString().slice(0, 10);

const ELEMENTOS_POR_PAGINA = 8;

export default function OrdenesPantalla() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [pedidoPago, setPedidoPago] = useState<Pedido | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const puedeCobrar = !(userRole === "cocinero" || userRole === "delivery");

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const rol = typeof u.rol === "string" ? u.rol.trim().toLowerCase() : "";
        setUserRole(rol);
      } catch {
        setUserRole("");
      }
    }
  }, []);

  // Al cambiar userRole, establecer filtro inicial solo para cocinero y delivery
  useEffect(() => {
    if (estadoSeleccionado === "") {
      if (userRole === "cocinero") {
        setEstadoSeleccionado(Estado.CONFIRMADO);
      } else if (userRole === "delivery") {
        setEstadoSeleccionado(Estado.LISTO);
      }
    }
  }, [userRole]);

  useEffect(() => { cargarPedidos(); }, []);
  const cargarPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  // Filtrar qué estados mostrar según rol
  const estadosVisibles = estadosDisponibles.filter(est =>
    permisosPorRol[userRole]?.includes(est.value)
  );
  const estadosAMostrar = estadosVisibles.filter(est => {
    if (est.value === "" && (userRole === "cocinero" || userRole === "delivery")) {
      return false;
    }
    return true;
  });

  // Filtrado combinado: estado, fecha y búsqueda
  const pedidosFiltrados = pedidos.filter(p => {
    // 1) Estado
    const matchEstado = estadoSeleccionado === "" || p.estado_pedido === estadoSeleccionado;

    // 2) Fecha: solo filtrar si no es uno de los excepciones
    const necesitaFiltrarPorFecha =
      !EXCEPCIONES_FECHA.includes(estadoSeleccionado as Estado);
    const fechaPedido = (typeof p.fecha_pedido === "string"
      ? p.fecha_pedido
      : p.fecha_pedido.toISODate()
    ); // Luxon DateTime to ISO date string (YYYY-MM-DD)
    const matchFecha = necesitaFiltrarPorFecha
      ? fechaPedido === hoyStr
      : true;

    // 3) Texto (nombre o ID)
    const termino = busqueda.toLowerCase();
    const nombre = `${p.usuario?.nombre ?? ""} ${p.usuario?.apellido ?? ""}`.toLowerCase();
    const matchNombre = nombre.includes(termino);
    const matchId = p.id?.toString().includes(termino);

    return matchEstado && matchFecha && (matchNombre || matchId);
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / ELEMENTOS_POR_PAGINA);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA
  );

  useEffect(() => { setPaginaActual(1); }, [estadoSeleccionado, busqueda]);

  const abrirModalDetalles = (p: Pedido) => {
    setPedidoSeleccionado(p);
    setModalDetallesOpen(true);
  };
  const cerrarModalDetalles = () => {
    setModalDetallesOpen(false);
    setPedidoSeleccionado(null);
  };

  const abrirModalPago = (p: Pedido) => {
    setPedidoPago(p);
    setModalPagoOpen(true);
  };
  const cerrarModalPago = () => {
    setModalPagoOpen(false);
    setPedidoPago(null);
  };
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
            { ...(puedeCobrar && { onCobrar: abrirModalPago }) }
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
