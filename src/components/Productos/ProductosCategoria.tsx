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
import Swal from 'sweetalert2';

export default function ProductosCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>();
  const [busqueda, setBusqueda] = useState("");
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

  // Función para abrir el modal (edición, nuevo o ver)
  function openModal(edit: boolean,isOpen: boolean, ProduManu?: ArticuloManufacturado) {
    setEditable(edit);
    setModalProductoId(ProduManu);
    setProdModalOpen(isOpen);
  }

  // Función para eliminar
  function deleteProducto(id: number) {
    return async () => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el Producto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
    
      if (!result.isConfirmed) return;
      deleteProductosById(id)
        .then(() => setArticulos((prev) => prev.filter((a) => a.id !== id)))
        .catch((e) => {
          throw new Error(`Error al eliminar el producto: ${e.message}`);
        });
    };
  }
  const articulosFiltrados = articulos.filter(p =>
    p.denominacion.toLowerCase().includes(busqueda.trim().toLowerCase())
  );
  return (
    <section className="products-page">
      <div className="buscador-contenedor">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <div className="header">
        <h2>Productos de: {categoria?.denominacion}</h2>
        <button onClick={() => openModal(true,true)}>Agregar +</button>
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
          {articulosFiltrados.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.denominacion}</td>
              <td>{a.descripcion}</td>
              <td>{a.tiempo_estimado_en_minutos}</td>
              <td>${a.precio_venta}</td>
              <td>
                <button 
                  title="Ver"
                  onClick={() => openModal(false, true, a!)}
                >👁️</button>

                <button
                  title="Editar"
                  onClick={() => openModal(true, true, a!)}
                >✏️</button>

                <button
                  title="Borrar"
                  onClick={deleteProducto(a.id!)}
                >🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        
        <Link to={`/admin/categorias/${categoria?.tipo_categoria?.id}`} className="btn-add">
          ← Volver
        </Link>
      </div>

      {/* Aquí va la condición para pintar el modal, fuera de la función openModal */}
      {prodModalOpen && (
        <ProductoManufacturadoModal
        editable={editable!}
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
