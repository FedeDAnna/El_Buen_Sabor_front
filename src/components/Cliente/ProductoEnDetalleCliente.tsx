// src/components/ArticuloDetallePage/ArticuloDetallePage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticuloManufacturadoById } from '../../services/FuncionesApi'
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado'


import '../../estilos/ProductoDetalleCliente.css'
import { useCart } from '../CartContext'


export default function ProductoEnDetalleCliente() {
    
  const { id } = useParams<Record<'id', string>>() 
  const navigate = useNavigate()  

  const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null)
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

    getArticuloManufacturadoById(Number(id))
      .then(data => {
        setArticulo(data)
      })
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar el artículo.')
      })
      .finally(() => setLoading(false))
  }, [id])

 const handleAgregarAlCarrito = () => {
   if (!articulo) return
   addToCart(articulo, cantidad)
   // Opcional: podrías mostrar un toast o mensaje breve
   alert(`Se agregaron ${cantidad} × "${articulo.denominacion}" al carrito.`)
 }

  const incrementar = () => setCantidad(prev => prev + 1)
  const decrementar = () => {
    if (cantidad > 1) setCantidad(prev => prev - 1)
  }

  return (
    <>
      
      <main className="adp-main">
        <button className="adp-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        {loading && <p className="adp-loading">Cargando artículo…</p>}
        {error && <p className="adp-error">{error}</p>}

        {!loading && !error && articulo && (
          <div className="adp-container">
            {/* Izquierda: imagen + precio + cantidad + botón */}
            <div className="adp-left">
              {articulo.imagen?.src ? (
                <img
                  src={articulo.imagen.src}
                  alt={articulo.imagen.alt || articulo.denominacion}
                  className="adp-img"
                />
              ) : (
                <div className="adp-placeholder-img">
                  No hay imagen disponible
                </div>
              )}

              <div className="adp-precio-cantidad">
                <div className="adp-quantity-selector">
                  <button onClick={decrementar} className="adp-btn-qty">–</button>
                  <span className="adp-qty">{cantidad}</span>
                  <button onClick={incrementar} className="adp-btn-qty">+</button>
                </div>
                <span className="adp-precio">
                  ${articulo.precio_venta.toLocaleString()}
                </span>
                <button
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
              <div className="adp-descripcion">
                <h3>Descripción:</h3>
                <p>{articulo.descripcion}</p>
              </div>
              <div className="adp-tiempo">
                <strong>Tiempo estimado:</strong> {articulo.tiempo_estimado_en_minutos} min
              </div>
            </div>
          </div>
        )}
      </main>
</>
  )
}
