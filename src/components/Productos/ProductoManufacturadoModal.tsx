import React, { useState, useEffect } from 'react'
    import { MdInfo } from "react-icons/md";
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
import Swal from 'sweetalert2'

interface Props {
  editable: boolean
  categoria?: Categoria
  ProductoManu?: ArticuloManufacturado
  onClose: () => void
  onSave: (created: ArticuloManufacturado) => void
}

export default function ProductoManufacturadoModal({
  editable,
  categoria,
  ProductoManu,
  onClose,
  onSave,
}: Props) {
  // Estados principales
  const [denominacion, setDenominacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tiempo, setTiempo] = useState<number>(0)
  const [precio, setPrecio] = useState<number>(0)
  const [preparacion, setPreparacion] = useState('')
  const [imagenData, setImagenData] = useState<string>('') // base64

  // Unidades e insumos
  const [unidades, setUnidades] = useState<UnidadDeMedida[]>([])
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | ''>('')
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([])
  const [loadingInsumos, setLoadingInsumos] = useState(true)

  // Detalles de insumos
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([])

  // Carga inicial de insumos y unidades
  useEffect(() => {
    fetchInsumos()
      .then(setInsumos)
      .catch(console.error)
      .finally(() => setLoadingInsumos(false))

    fetchUnidadesDeMedida()
      .then(setUnidades)
      .catch(console.error)
  }, [])

  // Si viene un ProductoManu para editar, precargar sus datos
  useEffect(() => {
    if (!ProductoManu) return

    setDenominacion(ProductoManu.denominacion ?? '')
    setDescripcion(ProductoManu.descripcion ?? '')
    setTiempo(ProductoManu.tiempo_estimado_en_minutos ?? 0)
    setPrecio(ProductoManu.precio_venta ?? 0)
    setPreparacion(ProductoManu.preparacion ?? '')

    if (ProductoManu.imagen?.src) {
      setImagenData(ProductoManu.imagen.src)
    }

    if (ProductoManu.unidad_de_medida?.id) {
      setSelectedUnidadId(ProductoManu.unidad_de_medida.id)
    }

    if (ProductoManu.detalles && ProductoManu.detalles.length > 0) {
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

  // Función para calcular la suma de costos de insumos
  const calculateCostSum = () => {
    return detalles.reduce((sum, d) => {
      if (
        d.articulo_insumo?.stock_insumo_sucursales &&
        d.articulo_insumo.stock_insumo_sucursales.length > 0 &&
        d.articulo_insumo.stock_insumo_sucursales[0].precio_compra &&
        d.cantidad
      ) {
        return sum + d.articulo_insumo.stock_insumo_sucursales[0].precio_compra * d.cantidad
      }
      return sum
    }, 0)
  }

  // Cada vez que cambian los detalles, recalcular precio sugerido (+100%) y setearlo
  useEffect(() => {
    const costSum = calculateCostSum()
    const suggested = parseFloat((costSum * 2).toFixed(2))
    setPrecio(suggested)
  }, [detalles])

  // Agregar/quitar/actualizar detalle
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

  // Control del input de precio: no bajar del costo total
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = Number(e.target.value)
    const minPrecio = calculateCostSum()
    setPrecio(Math.max(inputVal, minPrecio))
  }

  const canSave = () => {
    return (
      denominacion.trim() &&
      descripcion.trim() &&
      tiempo > 0 &&
      precio > 0 &&
      detalles.length > 0
    )
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

    const art = new ArticuloManufacturado()
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

    if (imagenData) {
      const img = new Imagen()
      img.src = imagenData
      img.alt = denominacion
      art.imagen = img
    }

    art.categoria = categoria
    art.detalles = detalles

    try {
      const created = await saveArticuloManufacturado(art)
      onSave(created)
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer
          toast.onmouseleave = Swal.resumeTimer
        },
      }).fire({
        icon: 'success',
        title: 'Producto creado/editado con éxito',
      })
    } catch (e) {
      console.error(e)
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer
          toast.onmouseleave = Swal.resumeTimer
        },
      }).fire({
        icon: 'error',
        title: 'Error al crear/editar producto',
      })
    }
  }

  return (
    <div className="pm-overlay">
      <div className="pm-modal">
        <header className="pm-header">
          <h2>
            {editable
              ? ProductoManu
                ? 'Editar Producto'
                : 'Nuevo Producto'
              : 'Ver Producto'}
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
            readOnly={!editable}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            readOnly={!editable}
          />
          <label>Tiempo en minutos:</label>
          <input
            type="number"
            placeholder="Tiempo en minutos"
            value={tiempo || ''}
            onChange={(e) => setTiempo(Number(e.target.value))}
            readOnly={!editable}
          />
          <label>
            Precio Venta:
            <i title='El precio se autocalcula con el valor de los insumos mas un 100% de ganancia'>
              <MdInfo />
            </i>
          </label>
          <input
            type="number"
            placeholder="Precio Venta"
            style={{ cursor: 'not-allowed' }}
            value={precio || ''}
            onChange={handlePrecioChange}
            min={calculateCostSum()}
            readOnly
          />
          <label>Unidad de Medida:</label>
          <select
            value={selectedUnidadId}
            disabled={!editable}
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
              disabled={!editable}
            />
          </div>

          <label>Imagen:</label>
          <img src={imagenData} alt="Preview" />
          {editable && (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}

          <div className="pm-insumos-header">
            <h3>Lista Insumos</h3>
            {editable && (
              <button className="btn-add" onClick={addDetalle}>
                Agregar Insumo +
              </button>
            )}
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
                      disabled={!editable}
                    >
                      <option value="" disabled>
                        Seleccione un insumo
                      </option>
                      {insumos
                        .filter((ins) => ins.es_para_elaborar)
                        .map((ins) => (
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
                        d.articulo_insumo?.unidad_de_medida?.denominacion ?? ''
                      }
                      value={d.cantidad || ''}
                      onChange={(e) =>
                        updateDetalle(i, 'cantidad', e.target.value)
                      }
                      readOnly={!editable}
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
            {editable ? 'Cancelar' : 'Cerrar'}
          </button>
          {editable && (
            <button
              className="btn-save"
              disabled={!canSave()}
              onClick={handleSubmit}
            >
              {ProductoManu ? 'Actualizar' : 'Guardar'}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
