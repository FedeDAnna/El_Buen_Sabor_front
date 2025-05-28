import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
//import { fetchArticulosPorCategoria } from '../../services/FuncionesApi';
import '../../estilos/Productos.css';           // reutiliza estilos de sección
import '../../estilos/ProductosTabla.css';      // o crea uno nuevo si lo prefieres
import type PedidoDetalle from '../../entidades/PedidoDetalle';

interface ArticuloManufacturado {
  id: number;
  descripcion: string ;
  tiempo_estimado_minutos: string;
  preparacion:string;
  detalles: PedidoDetalle[];

  denominacion: string ;
  precioVenta: number ;
  imagen: string;
}

const mockData: ArticuloManufacturado[] = [
  { id: 128, descripcion: "hamburgesas con mucho queso y una bandera",tiempo_estimado_minutos: "30", preparacion: "preparacion" , detalles: [], denominacion: "Flag Burger", precioVenta: 2333, imagen:"Imagen",}
  /* … */
];

export default function ProductosCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string|null>(null);
/**
  useEffect(() => {
    if (!categoriaId) return;
    setCargando(true);
    fetchArticulosPorCategoria(Number(categoriaId))
      .then(setArticulos)
      .catch((e) => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  }, [categoriaId]);

  if (cargando) return <p>Cargando productos…</p>;
  if (error) return <p>{error}</p>;
 */

  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos de: CATEGORIA</h2>
        
        <button className="btn-add">Agregar +</button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Tiempo (min)</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.denominacion}</td>
              <td>{a.descripcion}</td>
              <td>{a.tiempo_estimado_minutos}</td>
              <td>${a.precioVenta}</td>
              <td>
                <button title="Ver">👁️</button>
                <button title="Editar">✏️</button>
                <button title="Borrar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <Link to="/admin/productos" className="btn-add">
          ← Volver
        </Link>
        </div>
    </section>
  );
}
