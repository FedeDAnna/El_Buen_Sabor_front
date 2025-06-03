import { useEffect, useState } from 'react';
import { getPedidos } from '../../services/FuncionesApi';
import Pedido from '../../entidades/Pedido';
import './Pedidos.css';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <section className="pedidos-page">
      <div className="header">
        <h2>Pedidos</h2>
        <div className="acciones-superior">
          <input type="text" placeholder="Buscar" className="input-buscar" />
          <button className="btn-buscar">🔍</button>
          <button className="btn-agregar">Agregar ➕</button>
        </div>
      </div>

      <table className="pedidos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario?.nombre ?? '---'}</td>
              <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
              <td>{pedido.estado_pedido?.nombre ?? '---'}</td>
              <td>${pedido.total.toFixed(2)}</td>
              <td>
                <button>👁️</button>
                <button>✏️</button>
                <button>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
