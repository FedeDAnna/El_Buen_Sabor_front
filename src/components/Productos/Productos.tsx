// src/components/Productos/Productos.tsx
import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../estilos/Productos.css'
import '../../estilos/ProductosTabla.css'
import CategoriaModal from './CategoriaModal'
import {
  getCategoriasByTipo,
  guardarCategoriaConHijos,
  deleteCategoriaById,
} from '../../services/FuncionesApi'
import type Categoria from '../../entidades/Categoria'
import Swal from 'sweetalert2'

export default function Productos() {
  const { idTipo } = useParams();
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([])

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editable, setEditable] = useState(false)
  const [categoriaEnModal, setCategoriaEnModal] = useState<Categoria | undefined>(undefined)

  const reload = useCallback(async () => {
    try {
      const data = await getCategoriasByTipo(Number(idTipo))
      setListaCategorias(data)
    } catch (e) {
      console.error('No se pudieron cargar categorías:', e)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleSave = async (cat: Categoria) => {
    try {
      console.log("Categoria en HandleSave", cat)
      await guardarCategoriaConHijos(cat)
      await reload()
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Categoria creada/editada con exito"
      });
    } catch (e) {
      console.error(e)
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Error al crear/editar la Categoria"
      });
    } finally {
      setModalAbierto(false)
      setCategoriaEnModal(undefined)
    }
  }

  // 6) Al hacer clic en “Borrar”, llamo al servicio y actualizo la lista local
  const handleDelete = (id?: number) => {
    return async () => {
      if (!id) return
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la categoría.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
    
      if (!result.isConfirmed) return;

      try {
        await deleteCategoriaById(id)
        // Quito de la lista local para no tener que recargar todo
        setListaCategorias(prev => prev.filter(c => c.id !== id))
        await reload()
      } catch (e: any) {
        console.error('Error al eliminar categoría:', e)
        alert('No se pudo eliminar la categoría')
      }
    }
  }

  // 7) Abrir el modal para ver o editar. Si viene una categoría, la paso como “editable” si edit=true
  const openModal = (edit: boolean, isOpen: boolean, cat?: Categoria) => {
    console.log("categoria:" , cat);
    setEditable(edit)
    setCategoriaEnModal(cat)
    setModalAbierto(isOpen)
  }

  return (
    <section className="products-page">
      <div className="header-insumo-producto">
        <h2>{idTipo === "2" ? 'Categorías Producto' : 'Categorías Insumo' }</h2>
        <button className="btn-add" onClick={() => openModal(true, true, undefined)}>
          Agregar +
        </button>
      </div>

      {/* 8) Tabla de categorías */}
      <table className="products-productos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaCategorias.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.denominacion}</td>
              <td>
                { idTipo === "1"?
                  <Link to={`/admin/insumos/${c.id}`} title="Ver insumos">INGRESAR</Link>
                :
                  <Link to={`/admin/productos/${c.id}`} title="Ver productos">INGRESAR</Link>
                }
                
                

                <button onClick={() => openModal(false, true, c)} title="Ver">
                  👁️
                </button>{' '}
                &nbsp;

                <button onClick={() => openModal(true, true, c)} title="Editar">
                  ✏️
                </button>{' '}
                &nbsp;

                <button onClick={handleDelete(c.id)} title="Borrar">
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {listaCategorias.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>
                No hay categorías para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 9) Modal para crear/editar categoría */}
      {modalAbierto && (
        <CategoriaModal
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
          idTipo={Number(idTipo)}
          initialData={categoriaEnModal} // Puedes pasar la categoría si es edición o undefined si es nueva
          editable={editable}           // Si editable==false, el modal será solo de consulta
        />
      )}
    </section>
  )
}
