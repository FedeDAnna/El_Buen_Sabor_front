
import { useState, useEffect } from 'react'
import { postTipoPromocion } from '../../services/FuncionesApi'
import '../../estilos/CategoriaModal.css'
import TipoPromocion from '../../entidades/TipoPromocion'

interface Props {
  initialData?: TipoPromocion
  editable?: boolean
  onClose: () => void
  onSave: (TipoPromocion: TipoPromocion) => void
}

export default function TipoPromocionModal({
  onClose,
  onSave,
  initialData,  
  editable = false  
}: Props) {

  const [descripcion, setDescripcion] = useState('')

  useEffect(()=>{
    if(!initialData) return

    setDescripcion(initialData.descripcion)
  }, [initialData])

  const handleSubmit = async () => {
    
    const tipoPromocion = new TipoPromocion();
    
    if (initialData?.id) {
    tipoPromocion.id = initialData.id
    }

    tipoPromocion.descripcion = descripcion
    try {
    const created = await postTipoPromocion(tipoPromocion)
    onSave(created)
    } catch (e) {
    console.error(e)
    alert('Error al guardar el producto')
    }
  }

  
  return (
    <div className="cm-overlay">
      <div className="cm-modal">
        <header className="cm-header">
          <h2>
            {initialData
              ? editable
                ? 'Editar Tipo Promocion'
                : 'Ver Tipo Promocion'
              : 'Nuevo Tipo Promocion'}
          </h2>
          <button className="cm-close" onClick={onClose}>×</button>
        </header>

        <div className="pm-body">
            <input
            type="text"
            placeholder="Descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            readOnly={!editable}
            />
        </div>

        <footer className="cm-footer">
          <button className="cm-cancel" onClick={onClose}>
            {editable ? 'Cancelar' : 'Cerrar'}
          </button>
          <button
            className="cm-save"
            disabled={!editable}
            onClick={(handleSubmit)}
          >
            Guardar
          </button>
        </footer>
      </div>
    </div>
  )
}
