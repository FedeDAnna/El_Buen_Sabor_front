// src/components/Productos/ProductosTabla.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../estilos/ProductosTabla.css';
import type Articulo from '../../entidades/Articulo';

interface Categoria {
  id: number;
  denominacion: string;
  articulos: Articulo[];
}

const mockData: Categoria[] = [
  { id: 128, denominacion: 'Hamburguesas',articulos: [] },
  /* … */
];

export default function ProductosTabla() {
  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Categoría</th>
          <th>Detalle</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mockData.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.denominacion}</td>
            <td>Detalle</td>
            <td>
              <Link to={`/admin/productos/${c.id}`} title="Ver productos">
                <span role="img" aria-label="ver">👁️</span>
              </Link>
              <button>✏️</button>
              <button>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
