import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../estilos/Productos.css';          
import '../../estilos/ProductosTabla.css';     
import {
  getArticulosManufacturadoPorCategoria,
  fetchCategoriaById,
  deleteProductosById,
} from '../../services/FuncionesApi';
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import type Categoria from '../../entidades/Categoria';
import ProductoManufacturadoModal from './ProductoManufacturadoModal';

export default function ProductosCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [modalProducto, setModalProductoId] = useState<ArticuloManufacturado | undefined>(undefined);
  const [categoria, setCategoria] = useState<Categoria | undefined>();

  // Cargar la categoría
  useEffect(() => {
    if (!categoriaId) return;
    fetchCategoriaById(Number(categoriaId))
      .then(setCategoria)
      .catch((e) => console.error(e));
  }, [categoriaId]);

  // Cargar artículos
  useEffect(() => {
    if (!categoriaId) return;
    setCargando(true);
    getArticulosManufacturadoPorCategoria(Number(categoriaId))
      .then(setArticulos)
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  }, [categoriaId]);

  if (cargando) return <p>Cargando productos…</p>;
  if (error) return <p>{error}</p>;

  // Función para abrir el modal (edición o nuevo)
  function openModal(isOpen: boolean, ProduManu?: ArticuloManufacturado) {
    setModalProductoId(ProduManu);
    setProdModalOpen(isOpen);
  }

  // Función para eliminar
  function deleteProducto(id: number) {
    return async () => {
      if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
      deleteProductosById(id)
        .then(() => setArticulos((prev) => prev.filter((a) => a.id !== id)))
        .catch((e) => {
          throw new Error(`Error al eliminar el producto: ${e.message}`);
        });
    };
  }

  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos de: {categoria?.denominacion}</h2>
        <button onClick={() => openModal(true)}>Agregar +</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
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

                <button
                  title="Editar"
                  onClick={() => openModal(true, a!)}
                >
                  ✏️
                </button>

                <button
                  title="Borrar"
                  onClick={deleteProducto(a.id!)}
                >
                  🗑️
                </button>
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

      {/* Aquí va la condición para pintar el modal, fuera de la función openModal */}
      {prodModalOpen && (
        <ProductoManufacturadoModal
          categoria={categoria}
          ProductoManu={modalProducto}
          onClose={() => setProdModalOpen(false)}
          onSave={(newProd) => {
            setArticulos((prev) =>
              modalProducto
                ? prev.map((art) => (art.id === newProd.id ? newProd : art))
                : [...prev, newProd]
            );
            setProdModalOpen(false);
          }}
        />
      )}
    </section>
  );
}
