
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
  tipo: TipoCategoria | null
}

interface Props {
  onClose: () => void
  onSave: (categoria: Categoria) => void
}

export default function CategoriaModal({ onClose, onSave }: Props) {
  // Lista de tipos desde el backend
  const [tipos, setTipos] = useState<TipoCategoria[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [typeError, setTypeError] = useState<string | null>(null)

  // Cargar tipos al montar
  useEffect(() => {
    fetchTiposCategoria()
      .then(setTipos)
      .catch(e => setTypeError(e.message))
      .finally(() => setLoadingTypes(false))
  }, [])

  // Estado del árbol en memoria
  const [root, setRoot] = useState<CategoriaNode>({
    id: uuid(),
    nombre: '',
    hijos: [],
    tipo: null,
  })

  // Funciones de árbol
  const updateNombre = (
    id: string,
    nombre: string,
    nodo: CategoriaNode
  ): CategoriaNode => {
    if (nodo.id === id) return { ...nodo, nombre }
    return { ...nodo, hijos: nodo.hijos.map(h => updateNombre(id, nombre, h)) }
  }

  // Aplica tipo a toda la subrama
  const applyTipoRecursively = (
    nodo: CategoriaNode,
    tipo: TipoCategoria
  ): CategoriaNode => ({
    ...nodo,
    tipo,
    hijos: nodo.hijos.map(h => applyTipoRecursively(h, tipo)),
  })

  const setTipoGlobal = (tipo: TipoCategoria) => {
    setRoot(r => applyTipoRecursively(r, tipo))
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
      <input
        type="text"
        placeholder={nivel === 0 ? 'Nombre de la Categoría' : 'SubCategoría'}
        value={nodo.nombre}
        onChange={e => setRoot(r => updateNombre(nodo.id, e.target.value, r))}
      />

      {/* Select de tipo solo en raíz */}
      {nivel === 0 && (
        <select
          disabled={loadingTypes}
          value={root.tipo?.id ?? ''}
          onChange={e => {
            const tipoSel = tipos.find(t => t.id === Number(e.target.value))
            if (tipoSel) setTipoGlobal(tipoSel)
          }}
          style={{ marginLeft: 8 }}
        >
          <option value="" disabled>
            {loadingTypes ? 'Cargando tipos...' : 'Seleccione un tipo'}
          </option>
          {tipos.map(t => (
            <option key={t.id} value={t.id}>{t.descripcion}</option>
          ))}
        </select>
      )}

      {/* Añadir hijo */}
      <button
        type="button"
        className="cm-add-btn"
        onClick={() => setRoot(r => addHijo(nodo.id, r))}
      >
        Añadir Subcategoría
      </button>

      {/* Añadir hermana (salvo raíz) */}
      {parentId && (
        <button
          type="button"
          className="cm-add-sibling-btn"
          onClick={() => setRoot(r => addHijo(parentId, r))}
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
    cat.denominacion     = node.nombre
    cat.tipo_categoria   = node.tipo ?? new TipoCategoria()
    cat.categorias_hijas = node.hijos.map(mapNodeToCategoria)
    return cat
  }

  return (
    <div className="cm-overlay">
      <div className="cm-modal">
        <header className="cm-header">
          <h2>Nueva Categoría</h2>
          <button className="cm-close" onClick={onClose}>×</button>
        </header>

        <div className="cm-body">
          {typeError && <p className="error">{typeError}</p>}
          {renderNodo(root, 0, null)}
        </div>

        <footer className="cm-footer">
          <button className="cm-cancel" onClick={onClose}>Cancelar</button>
          <button
            className="cm-save"
            disabled={!root.nombre.trim() || !root.tipo}
            onClick={() => onSave(mapNodeToCategoria(root))}
          >
            Guardar
          </button>
        </footer>
      </div>
    </div>
  )
}
