import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../estilos/InsumosCategoria.css';     
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
  const [busqueda, setBusqueda] = useState("");
  const [insumModalOpen, setInsumModalOpen] = useState(false); //check
  const [modalInsumo, setModalInsumo] = useState<ArticuloInsumo | undefined>(undefined); //check
  const [categoria, setCategoria] = useState<Categoria | undefined>(); //check



  // Cargar la categoría
  useEffect(() => {
    if (!categoriaId) return;

    setCargando(true);
    fetchCategoriaById(Number(categoriaId))
      .then(setCategoria)
      .catch((e) => console.error(e));

    
    getArticulosInsumoPorCategoria(Number(categoriaId))
      .then(setArticulos)
      .catch(() => setError('No se pudieron cargar los insumos'))
      .finally(() => setCargando(false));

  }, [categoriaId]);

  useEffect(() => {
    if (cargando) return;
    const hayCritico = articulos.some(a => {
      const s = a.stock_insumo_sucursales?.[0];
      if (!s) return false;
      return s.stock_actual <= s.stock_minimo || s.stock_actual >= s.stock_maximo;
    });
    if (hayCritico) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Hay al menos 1 insumo cuyo stock está fuera de los límites configurados.',
      });
    }
  }, [cargando]);

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
   const articulosFiltrados = articulos.filter(a =>
    a.denominacion.toLowerCase().includes(busqueda.trim().toLowerCase())
  );
  return (
    <section className="products-page">
      {/* <div className="buscador-contenedor">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar insumo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div> */}
      <div className="header">
        <h2>Productos de: {categoria?.denominacion}</h2>
        <div>
          <div className="buscador-contenedor">
            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar insumo..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <button onClick={() => openModal(true,true)}>Agregar +</button>
        </div>
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
          {articulosFiltrados.map(a => {
            const stockEntry = a.stock_insumo_sucursales?.[0];
            const actual = stockEntry?.stock_actual ?? 0;
            const low = stockEntry ? actual <= (stockEntry.stock_minimo ?? 0) : false;
            const high = stockEntry ? actual >= (stockEntry.stock_maximo ?? Infinity) : false;
            const rowClass = low ? 'low-stock' : high ? 'high-stock' : '';
            return (
              <tr key={a.id} className={rowClass}>
                <td>{a.id}</td>
                <td>{a.denominacion}</td>
                <td>{a.es_para_elaborar ? 'SI' : 'NO'}</td>
                <td>${a.precio_venta}</td>
                <td>{a.unidad_de_medida?.denominacion}</td>
                <td>
                  <button title="Ver" onClick={() => openModal(false, true, a)}>👁️</button>
                  <button title="Editar" onClick={() => openModal(true, true, a)}>✏️</button>
                  <button title="Borrar" onClick={deleteProducto(a.id!)}>🗑️</button>
                </td>
              </tr>
            );
          })}
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
