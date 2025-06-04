// src/components/Productos/Productos.tsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../estilos/Productos.css'
import '../../estilos/ProductosTabla.css'
import CategoriaModal from './CategoriaModal'
import {
  getCategoriasByTipo,
  guardarCategoriaConHijos,
  deleteCategoriaById,
} from '../../services/FuncionesApi'
import type Categoria from '../../entidades/Categoria'

export default function Productos() {
  // 1) Estado local para la lista de categorías
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([])

  // 2) Control del modal para crear/editar categoría
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editable, setEditable] = useState(false)
  const [categoriaEnModal, setCategoriaEnModal] = useState<Categoria | undefined>(undefined)

  // 3) Función para recargar el listado desde el backend
  const reload = useCallback(async () => {
    try {
      const data = await getCategoriasByTipo(2) // 2 = tipo de categoría “manufacturado”
      setListaCategorias(data)
    } catch (e) {
      console.error('No se pudieron cargar categorías:', e)
    }
  }, [])

  // 4) Al montar, hago la carga inicial
  useEffect(() => {
    reload()
  }, [reload])

  // 5) Al salvar (tanto crear como editar), envío al backend y recargo
  const handleSave = async (cat: Categoria) => {
    try {
      await guardarCategoriaConHijos(cat)
      await reload()
    } catch (e) {
      console.error(e)
      alert('Falló al guardar la categoría')
    } finally {
      setModalAbierto(false)
      setCategoriaEnModal(undefined)
    }
  }

  // 6) Al hacer clic en “Borrar”, llamo al servicio y actualizo la lista local
  const handleDelete = (id?: number) => {
    return async () => {
      if (!id) return
      const confirmado = window.confirm('¿Estás seguro de eliminar esta categoría?')
      if (!confirmado) return

      try {
        await deleteCategoriaById(id)
        // Quito de la lista local para no tener que recargar todo
        setListaCategorias(prev => prev.filter(c => c.id !== id))
      } catch (e: any) {
        console.error('Error al eliminar categoría:', e)
        alert('No se pudo eliminar la categoría')
      }
    }
  }

  // 7) Abrir el modal para ver o editar. Si viene una categoría, la paso como “editable” si edit=true
  const openModal = (edit: boolean, isOpen: boolean, cat?: Categoria) => {
    setEditable(edit)
    setCategoriaEnModal(cat)
    setModalAbierto(isOpen)
  }

  return (
    <section className="products-page">
      <div className="header">
        <h2>Categorías</h2>
        <button className="btn-add" onClick={() => openModal(true, true, undefined)}>
          Agregar +
        </button>
      </div>

      {/* 8) Tabla de categorías */}
      <table className="products-table">
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
                {/* Enlace a ver productos manufacturados en esa categoría */}
                <Link to={`/admin/productos/${c.id}`} title="Ver productos">INGRESAR</Link>{' '}
                &nbsp;

                {/* Botón “Ver” (solo lectura) */}
                <button onClick={() => openModal(false, true, c)} title="Ver">
                  👁️
                </button>{' '}
                &nbsp;

                {/* Botón “Editar” */}
                <button onClick={() => openModal(true, true, c)} title="Editar">
                  ✏️
                </button>{' '}
                &nbsp;

                {/* Botón “Borrar” */}
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
          onClose={() => {
            setModalAbierto(false)
            setCategoriaEnModal(undefined)
          }}
          onSave={handleSave}
          initialData={categoriaEnModal} // Puedes pasar la categoría si es edición o undefined si es nueva
          readOnly={!editable}           // Si editable==false, el modal será solo de consulta
        />
      )}
    </section>
  )
}
