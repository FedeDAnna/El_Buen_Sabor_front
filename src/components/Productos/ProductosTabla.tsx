// src/components/Productos/ProductosTabla.tsx

import { Link } from 'react-router-dom';
import '../../estilos/ProductosTabla.css';
import type Categoria from '../../entidades/Categoria';



interface ProductosTablaProps {
  categorias: Categoria[]
}

export default function ProductosTabla({
  categorias = [],      
}: ProductosTablaProps) {
  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map(c => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.denominacion}</td>
            <td>
              <Link to={`/admin/productos/${c.id}`} title="Ver productos">
                👁️
              </Link>
              <button>✏️</button>
              <button>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}