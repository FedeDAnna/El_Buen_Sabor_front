
import { useState, useEffect } from 'react'
import { v4 as uuid }      from 'uuid'
import Categoria           from '../../entidades/Categoria'
import TipoCategoria       from '../../entidades/TipoCategoria'
import { fetchTiposCategoria } from '../../services/FuncionesApi'
import '../../estilos/CategoriaModal.css'

export type CategoriaNode = {
  id: string
  nombre: string
  hijos: CategoriaNode[]
  tipo: TipoCategoria
}

interface Props {
  initialData?: Categoria
  editable?: boolean
  idTipo: number
  onClose: () => void
  onSave: (categoria: Categoria) => void
}

export default function CategoriaModal({
  onClose,
  onSave,
  idTipo,
  initialData,   // puede venir undefined si estamos “creando nueva categoría”
  editable = false  // por defecto false (modo editable)
}: Props) {
  // Lista de tipos desde el backend
  const [tipos, setTipos] = useState<TipoCategoria[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [typeError, setTypeError] = useState<string | null>(null)
  // Estado del árbol en memoria
  const [root, setRoot] = useState<CategoriaNode>({
    id: uuid(),
    nombre: '',
    hijos: [],
    tipo: new TipoCategoria(),
  })


  // Cargar tipos al montar
  useEffect(() => {
    fetchTiposCategoria()
      .then(setTipos)
      .catch(e => setTypeError(e.message))
      .finally(() => setLoadingTypes(false))
  }, [])

  

  useEffect(() => {
    if (loadingTypes) return

    // buscamos el tipo que viene por props
    const tipoSeleccionado =
      tipos.find(t => t.id === idTipo) ?? new TipoCategoria()

    // función recursiva para aplicar el tipo a toda la rama
    const applyTipo = (node: CategoriaNode): CategoriaNode => ({
      ...node,
      tipo: tipoSeleccionado,
      hijos: node.hijos.map(applyTipo),
    })

    if (initialData) {
      // mapeo initialData → tree node
      const mapCatToNode = (cat: Categoria): CategoriaNode => ({
        id: cat.id?.toString() ?? uuid(),
        nombre: cat.denominacion,
        tipo: tipoSeleccionado,
        hijos: (cat.categorias_hijas ?? []).map(mapCatToNode),
      })
      setRoot(applyTipo(mapCatToNode(initialData)))
    } else {
      // nueva categoría: sólo raíz con tipo
      setRoot({
        id: uuid(),
        nombre: '',
        hijos: [],
        tipo: tipoSeleccionado,
      })
    }
  }, [loadingTypes, tipos, idTipo, initialData])

  // Funciones de árbol
  const updateNombre = (
    id: string,
    nombre: string,
    nodo: CategoriaNode
  ): CategoriaNode => {
    if (nodo.id === id) return { ...nodo, nombre }
    return { ...nodo, hijos: nodo.hijos.map(h => updateNombre(id, nombre, h)) }
  }

  const addHijo = (
    parentId: string,
    nodo: CategoriaNode
  ): CategoriaNode => {
    if (nodo.id === parentId) {
      return {
        ...nodo,
        hijos: [
          ...nodo.hijos,
          { id: uuid(), nombre: '', hijos: [], tipo: nodo.tipo },
        ],
      }
    }
    return { ...nodo, hijos: nodo.hijos.map(h => addHijo(parentId, h)) }
  }

  // Render recursivo de cada nodo
  const renderNodo = (
    nodo: CategoriaNode,
    nivel: number,
    parentId: string | null
  ) => (
    <div key={nodo.id} className="cm-nodo" style={{ marginLeft: nivel * 20 }}>

      {nivel === 0 && (
        <h3>{tipos.find(t => t.id === idTipo)?.descripcion}</h3>
        
        // <select
        //   disabled={!editable}
        //   value={root.tipo?.id ?? ''}
        //   onChange={e => {
        //     const tipoSel = tipos.find(t => t.id === Number(e.target.value))
        //     if (tipoSel) setTipoGlobal(tipoSel)
        //   }}
        //   style={{ marginLeft: 8 }}
        // >
        //   <option value="" disabled>
        //     {loadingTypes ? 'Cargando tipos...' : 'Seleccione un tipo'}
        //   </option>
        //   {tipos.map(t => (
        //     <option key={t.id} value={t.id}>{t.descripcion}</option>
        //   ))}
        // </select>
      )}
      
      <input
        type="text"
        placeholder={nivel === 0 ? 'Nombre de la Categoría' : 'SubCategoría'}
        value={nodo.nombre}
        readOnly={!editable}
        onChange={e => {
          if (editable) {
            setRoot(r => updateNombre(nodo.id, e.target.value, r))
          }
        }}
      />

      {/* Select de tipo solo en raíz */}

      <button
        type="button"
        className="cm-add-btn"
        disabled={!editable}
        onClick={() => {
          if (editable) {
            setRoot(r => addHijo(nodo.id, r))
          }
        }}
      >
        Añadir Subcategoría
      </button>

      {parentId && (
        <button
          type="button"
          className="cm-add-sibling-btn"
          disabled={!editable}
          onClick={() => {
            if (editable) {
              setRoot(r => addHijo(parentId, r))
            }
          }}
        >
          Añadir Hermana
        </button>
      )}

      {/* Hijos */}
      {nodo.hijos.map(child => renderNodo(child, nivel + 1, nodo.id))}
    </div>
  )

  // Mapear al objeto Categoria
  const mapNodeToCategoria = (node: CategoriaNode): Categoria => {
    const cat = new Categoria()
    // Convertir el ID de string a number, si aplica:
    const numericId = Number(node.id)
    if (!isNaN(numericId)) {
      cat.id = numericId
    }
    cat.denominacion = node.nombre
    cat.tipo_categoria = node.tipo
    cat.categorias_hijas = node.hijos.map(mapNodeToCategoria)
    return cat
  }

  
  return (
    <div className="cm-overlay">
      <div className="cm-modal">
        <header className="cm-header">
          <h2>
            {initialData
              ? editable
                ? 'Editar Categoría'
                : 'Ver Categoría'
              : 'Nueva Categoría'}
          </h2>
          <button className="cm-close" onClick={onClose}>×</button>
        </header>

        <div className="cm-body">
          {typeError && <p className="error">{typeError}</p>}
          {renderNodo(root, 0, null)}
        </div>

        <footer className="cm-footer">
          <button className="cm-cancel" onClick={onClose}>
            {editable ? 'Cancelar' : 'Cerrar'}
          </button>
          <button
            className="cm-save"
            disabled={
              !editable || // si no es editable, no permita guardar
              !root.nombre.trim() || // nombre obligatorio
              root.tipo === null // tipo obligatorio en la raíz
            }
            onClick={() => onSave(mapNodeToCategoria(root))}
          >
            Guardar
          </button>
        </footer>
      </div>
    </div>
  )
}
