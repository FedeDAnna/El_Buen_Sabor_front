import React, { useState, useEffect } from 'react'
import {
  fetchUnidadesDeMedida,
  saveArticuloInsumo,
} from '../../services/FuncionesApi'
import ArticuloInsumo from '../../entidades/ArticuloInsumo'
import '../../estilos/ProductoModal.css'
import Imagen from '../../entidades/Imagen'
import Categoria from '../../entidades/Categoria'
import UnidadDeMedida from '../../entidades/UnidadDeMedida'
import StockInsumoSucursales from '../../entidades/StockInsumoSucursales'
import Swal from 'sweetalert2'

interface Props {
  editable: boolean
  categoria?: Categoria
  ProductoInsumo?: ArticuloInsumo
  onClose: () => void
  onSave: (created: ArticuloInsumo) => void
}

export default function InsumoModal({
  editable,
  categoria,
  ProductoInsumo,
  onClose,
  onSave,
}: Props) {
  
  // Si llega ProductoInsumo, vamos a editar. Si no, se crea nuevo.
  const [denominacion, setDenominacion] = useState('')
  const [unidadDeMedida, setUnidadDeMedida] = useState('') //valido
  const [esParaElaborar, setEsParaElaborar] = useState<boolean>(true)
  const [precio, setPrecio] = useState<number>(0)  //valido
  const [imagenData, setImagenData] = useState<string>('') // base64

  const [unidades, setUnidades] = useState<UnidadDeMedida[]>([])
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | ''>('')
  const [stock, setStock] = useState<StockInsumoSucursales>(
    () => new StockInsumoSucursales()
  )

  useEffect(()=>{
    fetchUnidadesDeMedida()
          .then(setUnidades)
          .catch(console.error)
  }, [])
  
  // Si ProductoManu existe, prefijar todos los estados
  useEffect(() => {
    if (!ProductoInsumo) return
    setDenominacion(ProductoInsumo.denominacion)
    setUnidadDeMedida(ProductoInsumo.unidad_de_medida?.denominacion ?? '')
    console.log(ProductoInsumo.unidad_de_medida?.denominacion)
    setEsParaElaborar(ProductoInsumo.es_para_elaborar ?? '')
    setPrecio(ProductoInsumo.precio_venta ?? 0)
    
    // Si existe una imagen asociada, convertirla a base64 o reutilizar el src
    if (ProductoInsumo.imagen?.src) {
      setImagenData(ProductoInsumo.imagen.src)
    }

    // Si la unidad de medida viene en el objeto, seleccionarla
    if (ProductoInsumo.unidad_de_medida?.id) {
      console.log("Hola")
      setSelectedUnidadId(ProductoInsumo.unidad_de_medida.id)
    }

    // precargamos el primer stock, si viene
    if (
      ProductoInsumo.stock_insumo_sucursales &&
      ProductoInsumo.stock_insumo_sucursales.length > 0
    ) {
      setStock(ProductoInsumo.stock_insumo_sucursales[0])
    }
  
    // Si vienen detalles, copiarlos en el estado
  }, [ProductoInsumo])

  const canSave = () => {
    return esParaElaborar !==null && precio > 0
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
    const art = new ArticuloInsumo()

    // Si venimos editando, le asignamos el id para que el backend lo actualice
    if (ProductoInsumo?.id) {
      art.id = ProductoInsumo.id
    }

    art.denominacion = denominacion
    art.es_para_elaborar = esParaElaborar
    art.precio_venta = precio
    art.categoria = categoria

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

    art.stock_insumo_sucursales = [stock]


    try {
      const created = await saveArticuloInsumo(art)
      onSave(created)
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
                    title: "Insumo creado/editado con exito"
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
                    title: "Error al crear/editar el insumo"
                  });
    }
  }
  
  return (
    <div className="pm-overlay">
      <div className="pm-modal">
        <header className="pm-header">
          <h2>
            
            {editable ? ProductoInsumo ? 'Editar Insumo' : 'Nuevo Insumo': 'Ver Insumo'}
          </h2>
          <button className="pm-close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="pm-body">
          <label>Denominacion</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            value={denominacion}
            onChange={(e) => setDenominacion(e.target.value)}
            readOnly={!editable}
          />
          <label>Es para Elaborar?</label>
          <select
            value={esParaElaborar ? "true" : "false"}
            disabled={!editable}
            onChange={(e) => setEsParaElaborar(e.target.value === "true" ? true : false )}>
             <option value="true">Si</option>
            <option value="false">No</option>
          </select>
          
          <label>Precio Venta:</label>
          <input
            type="number"
            placeholder="Precio Venta"
            value={precio || ''}
            onChange={(e) => setPrecio(Number(e.target.value))}
            readOnly={!editable}
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

        <label>Imagen:</label>
          { imagenData
            ? <img src={imagenData} alt="Descripción de la imagen" />
            : null
          }
          {editable? (<input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />) : ''}

          <fieldset className="pm-stock-fieldset">
          <legend>Stock / Precio Compra</legend>

          <label>Precio de Compra</label>
          <input
            type="number"
            value={stock.precio_compra}
            onChange={(e) =>
              setStock({
                ...stock,
                precio_compra: Number(e.target.value),
              })
            }
            readOnly={!editable}
          />

          <label>Stock Actual</label>
          <input
            type="number"
            value={stock.stock_actual}
            onChange={(e) =>
              setStock({
                ...stock,
                stock_actual: Number(e.target.value),
              })
            }
            readOnly={!editable}
            min="1"
          />

          <label>Stock Máximo</label>
          <input
            type="number"
            value={stock.stock_maximo}
            onChange={(e) =>
              setStock({
                ...stock,
                stock_maximo: Number(e.target.value),
              })
            }
            readOnly={!editable}
            min="1"
          />

          <label>Stock Mínimo</label>
          <input
            type="number"
            value={stock.stock_minimo}
            onChange={(e) =>
              setStock({
                ...stock,
                stock_minimo: Number(e.target.value),
              })
              
            }
            min="1"
            readOnly={!editable}
          />
        </fieldset>
        </div>

        

        <footer className="pm-footer">
          
          <button className="btn-cancel" onClick={onClose}>
            {editable ? 'Cancelar' : 'Cerrar'}
          </button>

          {editable ? (<button
            className="btn-save"
            disabled={!canSave()}
            onClick={handleSubmit}
          >
            {ProductoInsumo ? 'Actualizar' : 'Guardar'}
          </button>) : ''}
          
        </footer>
      </div>
    </div>
  )
}
