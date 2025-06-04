import React, { useEffect, useState } from "react";
import  Pedido  from "../../entidades/Pedido";
import  Estado  from "../../entidades/Estado";
import { getPedidos } from "../../services/FuncionesApi"; // función simulada para traer pedidos

const estadosDisponibles = ["Pendiente", "En Preparación", "Demorado", "Listo"];

const OrdenesPantalla = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("Pendiente");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const data = await getPedidos(); // llamás a tu backend
    setPedidos(data);
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) => pedido.estado.nombre === estadoSeleccionado
  );

  return (
    <div className="ordenes-container">
      <h2>📋 Órdenes</h2>

      {/* Filtros */}
      <div className="filtros">
        {estadosDisponibles.map((estado) => (
          <button
            key={estado}
            onClick={() => setEstadoSeleccionado(estado)}
            className={estadoSeleccionado === estado ? "activo" : ""}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th>ORDEN</th>
            <th>CLIENTE</th>
            <th>FECHA</th>
            <th>HORA ESTIMADA</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>#{pedido.id}</td>
              <td>{pedido.usuario.nombre} {pedido.usuario.apellido}</td>
              <td>{pedido.fecha}</td>
              <td>{pedido.horaEstimadaFinalizacion}</td>
              <td>{pedido.estado.nombre}</td>
              <td>✅</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="paginacion">
        <button onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}>‹</button>
        <span>{paginaActual}</span>
        <button onClick={() => setPaginaActual((prev) => prev + 1)}>›</button>
      </div>
    </div>
  );
};

export default OrdenesPantalla;
