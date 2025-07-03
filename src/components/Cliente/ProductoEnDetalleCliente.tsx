// src/components/ArticuloDetallePage/ArticuloDetallePage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getArticuloInsumoById, getArticuloManufacturadoById } from '../../services/FuncionesApi'
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import '../../estilos/ProductoDetalleCliente.css'
import { useCart } from '../CartContext'
import type ArticuloInsumo from '../../entidades/ArticuloInsumo'
import Swal from 'sweetalert2'  

function isManufacturado(
    p: ArticuloManufacturado | ArticuloInsumo
  ): p is ArticuloManufacturado {
    return 'tiempo_estimado_en_minutos' in p
  }

type LocationState = { tipo: 'manufacturado' | 'insumo', hasStock: boolean }


export default function ProductoEnDetalleCliente() {

  const { id } = useParams<Record<'id', string>>() 
  const { state } = useLocation() as { state: LocationState }

  console.log("TIPO", state.tipo)
  console.log("hasStock", state.hasStock)
  const navigate = useNavigate()  

  const [articulo, setArticulo] = useState<ArticuloManufacturado | ArticuloInsumo>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const { addToCart } = useCart()

  // Control de cantidad (para el input +/-)
  const [cantidad, setCantidad] = useState<number>(1)

  useEffect(() => {
    if (!id) {
      setError('ID de artículo inválido')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    
    const loader =
      state.tipo === 'manufacturado'
        ? getArticuloManufacturadoById(+id)
        : getArticuloInsumoById(+id)

    loader
      .then(a => setArticulo(a))
      .catch(() => setError('No se pudo cargar el artículo'))
      .finally(() => setLoading(false))
    
  }, [id])

 const handleAgregarAlCarrito = () => {
   if (!articulo) return
   addToCart(articulo, "articulo", cantidad)
   // Opcional: podrías mostrar un toast o mensaje breve
   Swal.fire({
      title: `Se agregaron ${cantidad} × "${articulo.denominacion}" al carrito.`,
      icon: 'success',
      draggable: true,
      showConfirmButton: false,
      timer: 2000
    })
 }

  const incrementar = () => setCantidad(prev => prev + 1)
  const decrementar = () => {
    if (cantidad > 1) setCantidad(prev => prev - 1)
  }

  return (
    <>
      
      <main className="adp-main">
        

        {loading && <p className="adp-loading">Cargando artículo…</p>}
        {error && <p className="adp-error">{error}</p>}

        {!loading && !error && articulo && (
          <div className="adp-container">
            {/* Izquierda: imagen + precio + cantidad + botón */}
            <div className="adp-left">
              {articulo.imagen?.src ? (
                <div className={`adp-img-wrapper ${!state.hasStock ? 'no-stock-img' : ''}`}>
                  <img
                    src={articulo.imagen.src}
                    alt={articulo.imagen.alt || articulo.denominacion}
                    className="adp-img"
                  />
                </div>
              ) : (
                <div className="adp-placeholder-img">
                  No hay imagen disponible
                </div>
              )}

              <div className="adp-precio-cantidad">
                <div className="adp-quantity-selector">
                  <button disabled={!state.hasStock} onClick={decrementar} className="adp-btn-qty">–</button>
                  <span className="adp-qty">{cantidad}</span>
                  <button disabled={!state.hasStock} onClick={incrementar} className="adp-btn-qty">+</button>
                </div>
                <span className="adp-precio">
                  ${articulo.precio_venta.toLocaleString()}
                </span>
                <button
                  disabled={!state.hasStock}
                  className="adp-btn-addcart"
                  onClick={handleAgregarAlCarrito}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>

            {/* Derecha: nombre, descripción y tiempo */}
            <div className="adp-right">
              <h1 className="adp-nombre">{articulo.denominacion}</h1>
                {isManufacturado(articulo) ? (
                  <>
                    <div className="adp-descripcion">
                      <h3>Descripción:</h3>
                      <p>{articulo.descripcion}</p>
                    </div>
                    <div className="adp-tiempo">
                      <strong>Tiempo estimado:</strong> {articulo.tiempo_estimado_en_minutos} min
                    </div>
                  </>
                ) : ( 
                  <>
                    <div className="adp-descripcion">
                      <h3>Descripción:</h3>
                      <p>Buena bebida para acompañar tus comidas</p>
                    </div>
                    <div className="adp-tiempo">
                      <strong>Tiempo estimado:</strong> 15 min
                    </div>
                  </>
                ) }
            </div>
          </div>
        )}
      </main>
</>
  )
}
