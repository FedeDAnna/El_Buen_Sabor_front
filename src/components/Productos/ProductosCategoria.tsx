import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../estilos/Productos.css';           // reutiliza estilos de sección
import '../../estilos/ProductosTabla.css';      // o crea uno nuevo si lo prefieres
import { getArticulosManufacturadoPorCategoria } from '../../services/FuncionesApi';
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import ProductoManufacturadoModal from './ProductoManufacturadoModal';


export default function ProductosCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [prodModalOpen, setProdModalOpen] = useState(false)
  const [selectedCatId] = useState(Number(categoriaId))

  useEffect(() => {
    if (!categoriaId) return;
    setCargando(true);
    getArticulosManufacturadoPorCategoria(Number(categoriaId))
      .then(setArticulos)
      .catch((e) => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  }, [categoriaId]);

  if (cargando) return <p>Cargando productos…</p>;
  if (error) return <p>{error}</p>;
 

  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos de: CATEGORIA</h2>
        
        <button onClick={() => setProdModalOpen(true)}>Agregar +</button>
        {prodModalOpen && (
          <ProductoManufacturadoModal
            categoriaId={selectedCatId}
            onClose={() => setProdModalOpen(false)}
            onSave={newProd => {
              setArticulos(prev => [...prev, newProd])
              setProdModalOpen(false)
            }}
          />
        )}
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
          {articulos.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.denominacion}</td>
              <td>{a.descripcion}</td>
              <td>{a.tiempo_estimado_en_minutos}</td>
              <td>${a.precio_venta}</td>
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
