import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Promocion from '../../entidades/Promocion'
import TipoPromocion from '../../entidades/TipoPromocion'
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import ArticuloInsumo from '../../entidades/ArticuloInsumo'
import Imagen from '../../entidades/Imagen'
import '../../estilos/PromocionModal.css'
import {
  getArticulosManufacturados,
  fetchInsumos,
  postPromocion,
} from '../../services/FuncionesApi'
import { DateTime } from 'luxon'
import type Articulo from '../../entidades/Articulo'
import Swal from 'sweetalert2'
import PromocionDetalle from '../../entidades/PromocionDetalle'

interface Props {
  initialData?: Promocion
  TipoPromocion: TipoPromocion
  editable: boolean
  onClose: () => void
  onSave: (promo: Promocion) => void
}

type Row = {
  rowId: string
  detalleId?: number
  articulo?: Articulo
  cantidad: number
}

export default function PromocionModal({
  initialData,
  TipoPromocion,
  editable,
  onClose,
  onSave,
}: Props) {
  // form state
  const [denominacion, setDenominacion] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [horaDesde, setHoraDesde] = useState('')
  const [horaHasta, setHoraHasta] = useState('')
  const [descripcionDescuento, setDescripcionDescuento] = useState('')
  const [imagenData, setImagenData] = useState<string>()
  
  const [rows, setRows] = useState<Row[]>([])
  const [articulosOptions, setArticulosOptions] = useState<(ArticuloManufacturado|ArticuloInsumo)[]>([])
  const [precioProm, setPrecioProm] = useState<number>(0)
  const [sugerencia, setSugerencia] = useState<number>(10)

  // calcular total de artículos para validación y límite
  const totalArticulos = rows.reduce(
    (s, r) => s + (r.articulo?.precio_venta || 0) * r.cantidad,
    0
  )

  // load options & initial
  useEffect(() => {
    Promise.all([getArticulosManufacturados(), fetchInsumos()])
      .then(([mfs, ins]) => {
        const validInsumos = ins.filter(i => !i.es_para_elaborar)
        setArticulosOptions([...mfs, ...validInsumos])
      })
    if (initialData) {
      
      setDenominacion(initialData.denominacion)
      setFechaDesde(initialData.fecha_desde.toISOString().slice(0,10))
      setFechaHasta(initialData.fecha_hasta.toISOString().slice(0,10))
      setHoraDesde(DateTime.fromJSDate(initialData.hora_desde.toJSDate()).toFormat('HH:mm'))
      setHoraHasta(DateTime.fromJSDate(initialData.hora_hasta.toJSDate()).toFormat('HH:mm'))
      setDescripcionDescuento(initialData.descripcion_descuento)
      setSugerencia(Number(initialData.porc_descuento))
      if (initialData.imagen) setImagenData(initialData.imagen.src)
      // rows
      //! CHECKEAR
      setRows(
        initialData.detalles!.map(det => ({
          rowId: uuid(),
          detalleId: det.id,
          articulo: det.articulo,
          cantidad: det.cantidad,
        }))
      )
    }
  }, [])

  // compute sum & suggestion
  useEffect(() => {
    const sum = rows.reduce((s, r) => s + ((r.articulo?.precio_venta||0) * (r.cantidad)), 0)
    
    if (sugerencia) {
      setPrecioProm(Math.round(sum * (1 - (Number(sugerencia)/100))))
    }
  }, [rows, sugerencia])

  const addRow = () =>
    setRows(r => [...r, { rowId: uuid(), cantidad: 1 }])
  const removeRow = (rowId: string) =>
    setRows(r => r.filter(x => x.rowId !== rowId))
  const updateArticulo = (rowId: string, artId: number) => {
    const art = articulosOptions.find(a => a.id === artId)
    setRows(r =>
      r.map(x =>
        x.rowId === rowId ? { ...x, articulo: art } : x
      )
    )
  }
  const updateCantidad = (rowId: string, qty: number) => {
    setRows(r =>
      r.map(x =>
        x.rowId === rowId ? { ...x, cantidad: qty } : x
      )
    )
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setImagenData(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!denominacion||!fechaDesde||!fechaHasta) return

    // validación: precioProm no puede exceder al total de artículos
    if (precioProm > totalArticulos) {
      Swal.fire({
        icon: 'error',
        title: 'Precio inválido',
        text: `El precio promocional no puede ser mayor que el total ($${totalArticulos}).`
      })
      return
    }

    const promo = new Promocion()
    if(initialData?.id) promo.id = initialData.id;
    promo.denominacion = denominacion
    promo.tipo_promocion = TipoPromocion
    promo.fecha_desde = new Date(fechaDesde)
    promo.fecha_hasta = new Date(fechaHasta)
    promo.hora_desde = DateTime.fromFormat(horaDesde,'HH:mm')
    promo.hora_hasta = DateTime.fromFormat(horaHasta,'HH:mm')
    promo.descripcion_descuento = descripcionDescuento
    promo.precio_promocional = Number(precioProm)
    promo.porc_descuento = Number(sugerencia)
    if (imagenData) promo.imagen = { src: imagenData, alt: denominacion } as Imagen

    promo.detalles = rows
      .filter(r => r.articulo)
      .map(r => {
        const det = new PromocionDetalle()
        if (r.detalleId) det.id = r.detalleId
        det.articulo = r.articulo
        det.cantidad = r.cantidad
        return det
      })
    console.log(promo.detalles)

    try {
      const promocion: Promocion = await postPromocion(promo)
      onSave(promocion)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: 'success',
        title: 'Promoción creada/editada con exito'
      });
    } catch (err) {
      console.error(err)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: 'error',
        title: 'Error al crear/editar la Promoción'
      });
    }
  }

  return (
    <div className="pm-overlay">
      <div className="pm-modal wide">
        <header className="pm-header">
          <h2>
            {initialData
              ? editable
                ? 'Editar Promoción'
                : 'Ver Promoción'
              : 'Nueva Promoción'}
          </h2>
          <button className="pm-close" onClick={onClose}>
            ×
          </button>
        </header>
        <form className="pm-body" onSubmit={handleSubmit}>
          <input
            type='text'
            value={denominacion}
            onChange={e => setDenominacion(e.target.value)}
            placeholder="Denominación"
            readOnly={!editable}
          />
          <div className="date-time-group">
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              readOnly={!editable}
            />
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              readOnly={!editable}
            />
            <input
              type="time"
              value={horaDesde}
              onChange={e => setHoraDesde(e.target.value)}
              readOnly={!editable}
            />
            <input
              type="time"
              value={horaHasta}
              onChange={e => setHoraHasta(e.target.value)}
              readOnly={!editable}
            />
          </div>
          <input
            type='text'
            value={descripcionDescuento}
            onChange={e => setDescripcionDescuento(e.target.value)}
            placeholder="Descripción de Descuento"
            readOnly={!editable}
          />

          <div className="pm-img-upload">
            {imagenData && (
              <img src={imagenData} alt="" className="preview" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={!editable}
              onChange={handleFile}
            />
          </div>

          <h3>Artículos en Promoción</h3>
          <table className="pm-articles-table">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.rowId}>
                  <td>
                    <select
                      disabled={!editable}
                      value={r.articulo?.id || ''}
                      onChange={e =>
                        updateArticulo(r.rowId, Number(e.target.value))
                      }
                    >
                      <option value="" disabled>
                        Seleccione...
                      </option>
                      {articulosOptions.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.denominacion}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={r.cantidad}
                      onChange={e =>
                        updateCantidad(r.rowId, Number(e.target.value))
                      }
                      readOnly={!editable}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={!editable}
                      onClick={() => removeRow(r.rowId)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editable && (
            <button
              type="button"
              className="btn-add-article"
              onClick={addRow}
            >
              + Agregar Artículo
            </button>
          )}

          <div className="pm-price-group">
            <div>
              <label>Total artículos:</label>
              <span>
                ${rows.reduce(
                  (s, r) =>
                    s + (r.articulo?.precio_venta || 0) * r.cantidad,
                  0
                )}
              </span>
            </div>
            <div>
              <label>% Descuento:</label>
              <input
                  disabled={!editable}
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={sugerencia}
                  onChange={e => {
                    const raw = Number(e.target.value);
                    const clamped = isNaN(raw)
                      ? 0
                      : Math.max(0, Math.min(100, Math.round(raw)));
                    setSugerencia(clamped);
                  }}
                  onBlur={() => {
                    // refuerzo al perder foco
                    if (sugerencia < 0) setSugerencia(0);
                    else if (sugerencia > 100) setSugerencia(100);
                  }}
                />
            </div>
            <div>
              <label>Precio promocional:</label>
              <input
                type="number"
                value={precioProm}
                min={0}
                max={totalArticulos}
                readOnly={!editable}
                onChange={e => {
                  const val = Number(e.target.value)
                  setPrecioProm(val > totalArticulos ? totalArticulos : val)
                }}
              />
            </div>
          </div>
        </form>
        <footer className="pm-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-save"
            disabled={!editable}
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </footer>
      </div>
    </div>
  )
}
