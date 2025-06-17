import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../estilos/Productos.css';          
import '../../estilos/ProductosTabla.css';     
import {
  fetchCategoriaById,
  deleteProductosById,
  getArticulosInsumoPorCategoria,
} from '../../services/FuncionesApi';
import type Categoria from '../../entidades/Categoria';
import InsumoModal from './InsumoModal';
import type ArticuloInsumo from '../../entidades/ArticuloInsumo';
import Swal from 'sweetalert2';


export default function InsumosCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>(); //check
  const [articulos, setArticulos] = useState<ArticuloInsumo[]>([]);//check
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>();

  const [insumModalOpen, setInsumModalOpen] = useState(false); //check
  const [modalInsumo, setModalInsumo] = useState<ArticuloInsumo | undefined>(undefined); //check
  const [categoria, setCategoria] = useState<Categoria | undefined>(); //check

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
    getArticulosInsumoPorCategoria(Number(categoriaId))
      .then(setArticulos)
      .catch(() => setError('No se pudieron cargar los insumos'))
      .finally(() => setCargando(false));
  }, [categoriaId]);

  if (cargando) return <p>Cargando productos…</p>;
  if (error) return <p>{error}</p>;

  // Función para abrir el modal (edición, nuevo o ver)
  function openModal(edit: boolean,isOpen: boolean, Insumo?: ArticuloInsumo) {
    setEditable(edit);
    setInsumModalOpen(isOpen);
    setModalInsumo(Insumo);
    console.log(Insumo)
  }

  // Función para eliminar
  function deleteProducto(id: number) {
    return async () => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el Insumo.",
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

  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos de: {categoria?.denominacion}</h2>
        <button onClick={() => openModal(true,true)}>Agregar +</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Es para elaborar</th>
            <th>Precio Venta</th>
            <th>Unidad Medida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.denominacion}</td>
              <td>{a.es_para_elaborar ? 'SI' : 'NO'}</td>
              <td>${a.precio_venta}</td>
              <td>{a.unidad_de_medida?.denominacion}</td>
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
      {insumModalOpen && (
        <InsumoModal
        editable={editable!}
        categoria={categoria}
          ProductoInsumo={modalInsumo}
          onClose={() => setInsumModalOpen(false)}
          onSave={(newProd) => {
            setArticulos((prev) =>
              modalInsumo
                ? prev.map((art) => (art.id === newProd.id ? newProd : art))
                : [...prev, newProd]
            );
            setInsumModalOpen(false);
          }}
        />
      )}
    </section>
  );
}
