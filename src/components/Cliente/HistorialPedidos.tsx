// src/components/HistorialPedidos.tsx
import { useEffect, useState } from 'react';
import {fetchHistorialPedidosClientes} from '../../services/FuncionesApi';
import HistorialPedidoCard from './HistorialPedidoCard';
import type { PedidoHistorialDTO } from '../../DTOs/DTO/PedidoHistorialDTO';
import '../../estilos/HistorialPedidosCliente.css';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState<PedidoHistorialDTO[]>([]);
  const [pagina, setPagina] = useState(0);
  const usuarioJSON = localStorage.getItem('usuario');
  // Convertir el string JSON en un objeto JavaScript
  const usuario = JSON.parse(usuarioJSON!);
  // Acceder al id del usuario
  const idUsuario = usuario.id;
  useEffect(() => {
    fetchHistorialPedidosClientes(pagina,idUsuario)
      .then(data => setPedidos(data));
  }, [pagina]);

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
