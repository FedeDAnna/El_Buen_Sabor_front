// src/components/Productos/ProductosTabla.tsx
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../../estilos/ProductosTabla.css';
import type Categoria from '../../entidades/Categoria';
import {getCategoriasManufacturados} from '../../services/FuncionesApi';





export default function ProductosTabla( ) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const getCategoriaManufacturado = async () => {
    const response:Categoria[] = await getCategoriasManufacturados();
    setCategorias(response);};
    getCategoriaManufacturado();
  }, [])
  

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Categoría</th>
          
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.denominacion}</td>
            
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
