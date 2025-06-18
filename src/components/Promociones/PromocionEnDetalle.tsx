// src/components/Cliente/PromocionEnDetalle.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import { getPromocionById } from '../../services/FuncionesApi'
import type Promocion from '../../entidades/Promocion'
import '../../estilos/PromocionDetalle.css'  // ya creado

export default function PromocionEnDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [promo, setPromo] = useState<Promocion | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    if (!id) {
      setError('Promoción inválida')
      setLoading(false)
      return
    }
    getPromocionById(Number(id))
      .then(p => setPromo(p))
      .catch(() => setError('No se pudo cargar la promoción'))
      .finally(() => setLoading(false))
  }, [id])

  const incrementar = () => setCantidad(c => c + 1)
  const decrementar = () => cantidad > 1 && setCantidad(c => c - 1)

  const handleAgregar = () => {
    if (!promo) return
    addToCart(promo,"promocion", cantidad)
    alert(`Añadiste ${cantidad} × "${promo.denominacion}" al carrito.`)
  }

  if (loading) return <p>Cargando promoción…</p>
  if (error)   return <p>{error}</p>
  if (!promo) return null

  return (
    <main className="pd-main">
      <button className="pd-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="pd-container">
        {/* Izquierda */}
        <div className="pd-left">
          {promo.imagen?.src ? (
            <img
              src={promo.imagen.src}
              alt={promo.denominacion}
              className="pd-img"
            />
          ) : (
            <div className="pd-noimg">No hay imagen disponible</div>
          )}

          <div className="pd-precio-cantidad">
            <div className="pd-quantity-selector">
              <button onClick={decrementar} className="pd-btn-qty">–</button>
              <span className="pd-qty">{cantidad}</span>
              <button onClick={incrementar} className="pd-btn-qty">+</button>
            </div>
            <span className="pd-precio">
              ${promo.precio_promocional.toLocaleString()}
            </span>
            <button
              className="pd-btn-addcart"
              onClick={handleAgregar}
            >
              Añadir al carrito
            </button>
          </div>
        </div>

        {/* Derecha */}
        <div className="pd-right">
          <h1 className="pd-nombre">{promo.denominacion}</h1>

          <div className="pd-descripcion">
            <h3>Descripción:</h3>
            <p>{promo.descripcion_descuento}</p>
          </div>

          <div className="pd-fechas">
            <strong>Válida desde:</strong>{' '}
            {new Date(promo.fecha_desde).toLocaleDateString()} hasta{' '}
            {new Date(promo.fecha_hasta).toLocaleDateString()}
          </div>

          <div className="pd-tiempo">
            <strong>Horario:</strong>{' '}
            {promo.hora_desde.toFormat('HH:mm')} –{' '}
            {promo.hora_hasta.toFormat('HH:mm')}
          </div>
        </div>
      </div>

      <br/>
      <br/>
      <br/>
      <br/>
    </main>
  )
}
