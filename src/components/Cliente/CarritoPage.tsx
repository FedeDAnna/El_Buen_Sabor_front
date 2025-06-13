import { useNavigate } from 'react-router-dom'
import '../../estilos/CarritoPage.css'
import { useCart, type CartItem } from '../CartContext'

export default function CarritoPage() {
  const navigate = useNavigate()
  const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart()

  const handleSiguiente = () => {
    navigate('/pedido/pago')
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-main">
        <h2>Tu carrito está vacío</h2>
        <p>
          Explora nuestros <a href="/categorias/0">productos</a> y agrégalos al carrito.
        </p>
      </main>
    )
  }

  return (
    <main className="cart-main">
      <h2>Mi Pedido</h2>

      <div className="cart-content">
        <div className="cart-items-container">
          {cartItems.map((item: CartItem) => {
            if (item.kind === 'articulo') {
              const p = item.producto
              return (
                <div key={`art-${p.id}`} className="cart-item-row">
                  <img
                    src={p.imagen?.src || '/assets/no-image.png'}
                    alt={p.denominacion}
                    className="cart-item-img-large"
                  />
                  <div className="cart-item-details">
                    <h3>{p.denominacion}</h3>
                    <p>
                      Precio unitario:{' '}
                      <strong>${p.precio_venta.toLocaleString()}</strong>
                    </p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(p.id!,'articulo', item.cantidad - 1)}
                        className="btn-qty"
                      >
                        –
                      </button>
                      <span className="qty-display">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(p.id!, 'articulo' ,item.cantidad + 1)}
                        className="btn-qty"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(p.id!,'articulo')}
                        className="btn-remove"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="cart-item-subtotal">
                      Subtotal:{' '}
                      <strong>
                        ${(p.precio_venta * item.cantidad).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                </div>
              )
            } else {
              const promo = item.promocion
              return (
                <div key={`promo-${promo.id}`} className="cart-item-row">
                  <img
                    src={promo.imagen?.src || '/assets/no-image.png'}
                    alt={promo.denominacion}
                    className="cart-item-img-large"
                  />
                  <div className="cart-item-details">
                    <h3>{promo.denominacion}</h3>
                    <p>
                      Precio promo:{' '}
                      <strong>${promo.precio_promocional.toLocaleString()}</strong>
                    </p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() =>
                          updateQuantity(promo.id!,'promocion' ,item.cantidad - 1, )
                        }
                        className="btn-qty"
                      >
                        –
                      </button>
                      <span className="qty-display">{item.cantidad}</span>
                      <button
                        onClick={() =>
                          updateQuantity(promo.id!,'promocion' ,item.cantidad + 1 )
                        }
                        className="btn-qty"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(promo.id!, 'promocion')}
                        className="btn-remove"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="cart-item-subtotal">
                      Subtotal:{' '}
                      <strong>
                        ${(promo.precio_promocional * item.cantidad).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                </div>
              )
            }
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="summary-line">
            <span>Envío:</span>
            <span>$0</span> {/* O un cálculo de envío si corresponde */}
          </div>
          <div className="summary-line total-pay">
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="btn-next" onClick={handleSiguiente}>
            Siguiente
          </button>
        </div>
      </div>
    </main>
  )
}
