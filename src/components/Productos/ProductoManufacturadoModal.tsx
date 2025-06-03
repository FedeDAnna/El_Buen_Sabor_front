import React, { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import {
  
  fetchInsumos,
  fetchUnidadesDeMedida,
  saveArticuloManufacturado,
} from '../../services/FuncionesApi'
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import ArticuloInsumo from '../../entidades/ArticuloInsumo'
import ArticuloManufacturadoDetalle from '../../entidades/ArticuloManufacturadoDetalle'
import '../../estilos/ProductoModal.css'
import Imagen from '../../entidades/Imagen'
import Categoria from '../../entidades/Categoria'
import UnidadDeMedida from '../../entidades/UnidadDeMedida'

interface Props {
  categoria?: Categoria
  ProductoManu?: ArticuloManufacturado
  onClose: () => void
  onSave: (created: ArticuloManufacturado) => void
}

export default function ProductoManufacturadoModal({
  categoria,
  ProductoManu,
  onClose,
  onSave,
}: Props) {
  // Si llega ProductoManu, vamos a editar. Si no, se crea nuevo.
  const [denominacion, setDenominacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tiempo, setTiempo] = useState<number>(0)
  const [precio, setPrecio] = useState<number>(0)
  const [preparacion, setPreparacion] = useState('')
  const [imagenData, setImagenData] = useState<string>('') // base64

  // Unidad de medida para el producto manufacturado
  const [unidades, setUnidades] = useState<UnidadDeMedida[]>([])
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | ''>('')

  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([])
  const [loadingInsumos, setLoadingInsumos] = useState(true)

  // Detalles: instancias de entidad
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([])

  // Cargar listas de insumos y unidades apenas monte el modal
  useEffect(() => {
    fetchInsumos()
      .then(setInsumos)
      .catch(console.error)
      .finally(() => setLoadingInsumos(false))

    fetchUnidadesDeMedida()
      .then(setUnidades)
      .catch(console.error)
  }, [])

  // Si ProductoManu existe, prefijar todos los estados
  useEffect(() => {
    if (!ProductoManu) return

    setDenominacion(ProductoManu.denominacion ?? '')
    setDescripcion(ProductoManu.descripcion ?? '')
    setTiempo(ProductoManu.tiempo_estimado_en_minutos ?? 0)
    setPrecio(ProductoManu.precio_venta ?? 0)
    setPreparacion(ProductoManu.preparacion ?? 'no hayyy')

    // Si existe una imagen asociada, convertirla a base64 o reutilizar el src
    if (ProductoManu.imagen?.src) {
      setImagenData(ProductoManu.imagen.src)
    }

    // Si la unidad de medida viene en el objeto, seleccionarla
    if (ProductoManu.unidad_de_medida?.id) {
      setSelectedUnidadId(ProductoManu.unidad_de_medida.id)
    }

    // Si vienen detalles, copiarlos en el estado
    if (ProductoManu.detalles && ProductoManu.detalles.length > 0) {
      // Hacemos un “clone” superficial de cada detalle para no mutar el original
      const copiaDetalles = ProductoManu.detalles.map((d) => {
        const det = new ArticuloManufacturadoDetalle()
        det.id = d.id
        det.cantidad = d.cantidad
        det.articulo_insumo = d.articulo_insumo
        return det
      })
      setDetalles(copiaDetalles)
    }
  }, [ProductoManu])

  const addDetalle = () => {
    const nuevo = new ArticuloManufacturadoDetalle()
    nuevo.cantidad = 0
    setDetalles((ds) => [...ds, nuevo])
  }

  const removeDetalle = (index: number) => {
    setDetalles((ds) => ds.filter((_, i) => i !== index))
  }

  const updateDetalle = (
    index: number,
    key: 'articulo_insumo' | 'cantidad',
    value: any
  ) => {
    setDetalles((ds) => {
      const copia = [...ds]
      const det = copia[index]
      if (key === 'cantidad') det.cantidad = Number(value)
      else det.articulo_insumo = value
      copia[index] = det
      return copia
    })
  }

  const canSave = () => {
    return denominacion.trim() && descripcion.trim() && tiempo > 0 && precio > 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagenData(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!canSave()) return

    // Construir instancia de ArticuloManufacturado (la creación del JSON no se cambia)
    const art = new ArticuloManufacturado()

    // Si venimos editando, le asignamos el id para que el backend lo actualice
    if (ProductoManu?.id) {
      art.id = ProductoManu.id
    }

    art.denominacion = denominacion
    art.descripcion = descripcion
    art.tiempo_estimado_en_minutos = tiempo
    art.precio_venta = precio
    art.preparacion = preparacion

    if (selectedUnidadId !== '') {
      const unidad = unidades.find((u) => u.id === selectedUnidadId)
      if (unidad) art.unidad_de_medida = unidad
    }

    // Asociar imagen si existe
    if (imagenData) {
      const img = new Imagen()
      img.src = imagenData
      img.alt = denominacion
      art.imagen = img
    }

    // Asociar categoría (mantiene igual)
    art.categoria = categoria

    // Asociar detalles (ya son instancias completas)
    art.detalles = detalles

    try {
      const created = await saveArticuloManufacturado(art)
      onSave(created)
    } catch (e) {
      console.error(e)
      alert('Error al guardar el producto')
    }
  }

  return (
    <div className="pm-overlay">
      <div className="pm-modal">
        <header className="pm-header">
          <h2>
            {ProductoManu ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button className="pm-close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="pm-body">
          <input
            type="text"
            placeholder="Nombre Producto"
            value={denominacion}
            onChange={(e) => setDenominacion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <label>Tiempo en minutos:</label>
          <input
            type="number"
            placeholder="Tiempo en minutos"
            value={tiempo || ''}
            onChange={(e) => setTiempo(Number(e.target.value))}
          />
          <label>Precio Venta:</label>
          <input
            type="number"
            placeholder="Precio Venta"
            value={precio || ''}
            onChange={(e) => setPrecio(Number(e.target.value))}
          />
          <label>Unidad de Medida:</label>
          <select
            value={selectedUnidadId}
            onChange={(e) => setSelectedUnidadId(Number(e.target.value))}
          >
            <option value="" disabled>
              Seleccione una unidad
            </option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.denominacion}
              </option>
            ))}
          </select>

          <label>Preparación:</label>
          <div className="pm-editor">
            <Editor
              init={{ height: 200, menubar: false }}
              value={preparacion}
              onEditorChange={setPreparacion}
            />
          </div>

          <label>Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="pm-insumos-header">
            <h3>Lista Insumos</h3>
            <button className="btn-add" onClick={addDetalle}>
              Agregar Insumo +
            </button>
          </div>
          <table className="pm-insumos-table">
            <thead>
              <tr>
                <th>Denominación</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, i) => (
                <tr key={i}>
                  <td>
                    <select
                      value={d.articulo_insumo?.id ?? ''}
                      onChange={(e) => {
                        const ins = insumos.find(
                          (x) => x.id === Number(e.target.value)
                        )
                        updateDetalle(i, 'articulo_insumo', ins)
                      }}
                      disabled={loadingInsumos}
                    >
                      <option value="" disabled>
                        Seleccione un insumo
                      </option>
                      {insumos.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                          {ins.denominacion}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder={
                        d.articulo_insumo?.unidad_de_medida
                          ?.denominacion ?? ''
                      }
                      value={d.cantidad || ''}
                      onChange={(e) =>
                        updateDetalle(i, 'cantidad', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => removeDetalle(i)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="pm-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-save"
            disabled={!canSave()}
            onClick={handleSubmit}
          >
            {ProductoManu ? 'Actualizar' : 'Guardar'}
          </button>
        </footer>
      </div>
    </div>
  )
}
