import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../estilos/Productos.css'
import '../../estilos/ProductosTabla.css'

import {
  getTiposPromociones,
  deleteTipoPromocionById,
} from '../../services/FuncionesApi'

import TipoPromocion from '../../entidades/TipoPromocion'
import TipoPromocionModal from './TipoPromocionModal'

export default function TipoPromocionesTabla() {
  const [listaTiposPromociones, setListaTiposPromociones] = useState<TipoPromocion[]>([])

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editable, setEditable] = useState(false)
  const [TipoPromocionEnModal, setTipoPromocionEnModal] = useState< TipoPromocion>()

  const reload = useCallback(async () => {
    try {
      const data = await getTiposPromociones()
      setListaTiposPromociones(data)
      console.log(data)
    } catch (e) {
      console.error('No se pudieron cargar categorías:', e)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleSave = async (tipo: TipoPromocion) => {
    try {
      await reload()
    } catch (e) {
      console.error(e)
      alert('Falló al guardar el tipo de promocion')
    } finally {
      setModalAbierto(false)
      setTipoPromocionEnModal(undefined)
    }
  }

  // 6) Al hacer clic en “Borrar”, llamo al servicio y actualizo la lista local
  const handleDelete = (id?: number) => {
    return async () => {
      if (!id) return
      const confirmado = window.confirm('¿Estás seguro de eliminar este Tipo de Promoción?')
      if (!confirmado) return

      try {
        await deleteTipoPromocionById(id)
        // Quito de la lista local para no tener que recargar todo
        setListaTiposPromociones(prev => prev.filter(c => c.id !== id))
        await reload()
      } catch (e: any) {
        console.error('Error al eliminar categoría:', e)
        alert('No se pudo eliminar la categoría')
      }
    }
  }

  // 7) Abrir el modal para ver o editar. Si viene una categoría, la paso como “editable” si edit=true
  const openModal = (edit: boolean, isOpen: boolean, cat?: TipoPromocion) => {
    console.log("categoria:" , cat);
    setEditable(edit)
    setTipoPromocionEnModal(cat)
    setModalAbierto(isOpen)
  }

  return (
    <section className="products-page">
      <div className="header">
        <h2>Tipos Promociones</h2>
        <button className="btn-add" onClick={() => openModal(true, true, undefined)}>
          Agregar +
        </button>
      </div>

                                                                                                                  <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <table className="promociones-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaTiposPromociones.map(tp => (
            <tr key={tp.id}>
              <td>{tp.id}</td>
              <td>{tp.descripcion}</td>
              <td>
                <Link to={`/admin/promocion/${tp.id}`} title="Ver Promocinoes">INGRESAR</Link>
                
                <button onClick={() => openModal(false, true, tp)} title="Ver">
                  👁️
                </button>{' '}
                &nbsp;

                <button onClick={() => openModal(true, true, tp)} title="Editar">
                  ✏️
                </button>{' '}
                &nbsp;

                <button onClick={handleDelete(tp.id)} title="Borrar">
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {listaTiposPromociones.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>
                No hay Tipos de Promociones
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 9) Modal para crear/editar categoría */}
      {modalAbierto && (
        <TipoPromocionModal
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
          
          initialData={TipoPromocionEnModal} // Puedes pasar la categoría si es edición o undefined si es nueva
          editable={editable}           // Si editable==false, el modal será solo de consulta
        />
      )}
    </section>
  )
}
