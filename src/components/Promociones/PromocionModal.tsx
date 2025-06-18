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

interface Props {
  initialData?: Promocion
  TipoPromocion: TipoPromocion
  editable: boolean
  onClose: () => void
  onSave: (promo: Promocion) => void
}

type Row = { id: string; articulo?: Articulo }

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
  const [sugerencia, setSugerencia] = useState<number | 'otro'>(10)

  console.log("INCIAL DATA",initialData)

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
      if (initialData.imagen) setImagenData(initialData.imagen.src)
      // rows
      //! CHECKEAR
      setRows(initialData.articulos.map(a => ({ id: uuid(), articulo: a })))
    }
  }, [])

  // compute sum & suggestion
  useEffect(() => {
    const sum = rows.reduce((s, r) => s + (r.articulo?.precio_venta||0), 0)
    
    if (sugerencia !== 'otro') {
    setPrecioProm(Math.round(sum * (1 - Number(sugerencia)/100)))
   }
  }, [rows, sugerencia])

  const addRow = () => setRows(rs => [...rs, { id: uuid() }])
  const removeRow = (id: string) => setRows(rs => rs.filter(r=>r.id!==id))
  const updateRow = (id:string, articuloId:number) => {
    const art = articulosOptions.find(a=>a.id===articuloId)
    setRows(rs => rs.map(r=>r.id===id?{...r,articulo:art}:r))
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ()=>{
      if (typeof reader.result==='string') setImagenData(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!denominacion||!fechaDesde||!fechaHasta) return
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
    if (imagenData) promo.imagen = { src: imagenData, alt: denominacion } as Imagen
    promo.articulos = rows.map(r=>r.articulo!).filter(Boolean)
    console.log(promo)
    try {
    const promocion : Promocion = await postPromocion(promo)
    onSave(promocion)
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
        title: "Promoción creada/editada con exito"
      });
  } catch (err) {
    console.error(err)
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
        title: "Error al crear/editar la Promoción"
      });
  }

  }

  return (
    <div className="pm-overlay">
      <div className="pm-modal wide">
        <header className="pm-header">
          <h2>{initialData ? (editable?'Editar':'Ver'):'Nueva'} Promoción</h2>
          <button className="pm-close" onClick={onClose}>×</button>
        </header>
        <form className="pm-body" onSubmit={handleSubmit}>
          <input value={denominacion} onChange={e=>setDenominacion(e.target.value)} placeholder="Denominación" readOnly={!editable}/>
          <div className="date-time-group">
            <input type="date" value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} readOnly={!editable}/>
            <input type="date" value={fechaHasta} onChange={e=>setFechaHasta(e.target.value)} readOnly={!editable}/>
            <input type="time" value={horaDesde} onChange={e=>setHoraDesde(e.target.value)} readOnly={!editable}/>
            <input type="time" value={horaHasta} onChange={e=>setHoraHasta(e.target.value)} readOnly={!editable}/>
          </div>
          <input value={descripcionDescuento} onChange={e=>setDescripcionDescuento(e.target.value)} placeholder="Descripción de Descuento" readOnly={!editable}/>
          <div className="pm-img-upload">
            {imagenData && <img src={imagenData} alt="" className="preview"/>}
            <input type="file" accept="image/*" onChange={handleImage} disabled={!editable}/>
          </div>

          <h3>Artículos</h3>
          <table className="pm-articles-table">
            <thead><tr><th>Artículo</th><th></th></tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id}>
                  <td>
                    <select disabled={!editable} value={r.articulo?.id||''} onChange={e=>updateRow(r.id,Number(e.target.value))}>
                      <option value="" disabled>Seleccione...</option>
                      {articulosOptions.map(a=>(
                        <option key={a.id} value={a.id}>{a.denominacion}</option>
                      ))}
                    </select>
                  </td>
                  <td><button type="button" disabled={!editable} onClick={()=>removeRow(r.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {editable && <button type="button" className="btn-add-article" onClick={addRow}>Ingresar Artículo</button>}

          <div className="pm-price-group">
            <div>
              <label>Total artículos: </label><span>${rows.reduce((s,r)=>(s+r.articulo?.precio_venta!||0),0)}</span>
            </div>
            <div>
              <label>Descuento:</label>
              <select disabled={!editable} value={sugerencia} onChange={e=>setSugerencia(e.target.value==='otro'?'otro':Number(e.target.value))}>
                {[10,15,20,30,50].map(p=> <option key={p} value={p}>{p}%</option>)}
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label>Precio promocional:</label>
              <input type="number" value={precioProm} onChange={e=>setPrecioProm(Number(e.target.value))} readOnly={!editable && sugerencia!=='otro'} min={0} />
            </div>
          </div>

        </form>
        <footer className="pm-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" disabled={!editable} onClick={handleSubmit}>Guardar</button>
        </footer>
      </div>
    </div>
  )
}
