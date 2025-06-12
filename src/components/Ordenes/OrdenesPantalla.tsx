import React, { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import { getPedidos } from "../../services/FuncionesApi";
import "../../estilos/OrdenesPantalla.css";
import Paginacion from "../Ordenes/Paginado";
import TablaPedidos from "./OrdenesTabla";
import ModalOrden from "./OrdenModal"; // Asegurate de tener este componente

const estadosDisponibles = [
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "Confirmado", value: "CONFIRMADO" },
  { label: "En Preparación", value: "EN_PREPARACION" },
  { label: "Demorado", value: "DEMORADO" },
  { label: "Listo", value: "LISTO" },
  { label: "Rechazado", value: "RECHAZADO" },
  { label: "Pagado", value: "PAGADO" },
  { label: "En Camino", value: "EN_CAMINO" },
  { label: "Entregado", value: "ENTREGADO" },
];

const ELEMENTOS_POR_PAGINA = 8;

function OrdenesPantalla() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("PENDIENTE");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) =>
      pedido.estado_pedido === estadoSeleccionado &&
      `${pedido.usuario?.nombre} ${pedido.usuario?.apellido}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(pedidosFiltrados.length / ELEMENTOS_POR_PAGINA);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [estadoSeleccionado, busqueda]);

  const abrirModal = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  return (
    <div className="ordenes-container">
      <div className="buscador-contenedor">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <h2>📋 Órdenes</h2>

      <div className="barra-superior">
        <div className="filtros">
          {estadosDisponibles.map((estado) => (
            <button
              key={estado.value}
              onClick={() => setEstadoSeleccionado(estado.value)}
              className={estadoSeleccionado === estado.value ? "activo" : ""}
            >
              {estado.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tabla-wrapper">
        {pedidosPaginados.length > 0 ? (
          <TablaPedidos pedidos={pedidosPaginados} onSeleccionar={abrirModal} />
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No se encontraron órdenes.
          </p>
        )}
      </div>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPaginaCambio={setPaginaActual}
      />

      {modalAbierto && pedidoSeleccionado && (
        <ModalOrden pedido={pedidoSeleccionado} onClose={cerrarModal} />
      )}
    </div>
  );
}

export default OrdenesPantalla;
