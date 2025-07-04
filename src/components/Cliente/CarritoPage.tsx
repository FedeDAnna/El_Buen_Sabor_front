import { useNavigate } from 'react-router-dom'
import '../../estilos/CarritoPage.css'
import { useCart, type CartItem } from '../CartContext'
import { Link } from 'react-router-dom'
import CarruselCategorias from './CarruselCategorias'
import Swal from 'sweetalert2'

export default function CarritoPage() {
  const navigate = useNavigate()
  const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart()
  

  const handleSiguiente = () => {
    const user = localStorage.getItem('usuario');
    if (!user) {
      Swal.fire('Error','Debés iniciar sesión para continuar con el pedido.','error');
      navigate('/login');
      return;
    } else {
      navigate('/pedido/pago')
    }
  }

  if (cartItems.length === 0) {
  return (
    <main className="cart-main cart-empty">
      <div className="cart-empty-wrapper">
        <div className="cart-empty-content">
          <img
            src="/imagenes/carritoVacio.png"
            alt="Carrito vacío"
            className="cart-empty-img"
          />
          <h2>Tu carrito está vacío</h2>
          <p>
            Explora nuestros{' '}
            <Link to="/categorias/1" className="cart-empty-link">
              productos
            </Link>{' '}
            y agrégalos al carrito. O vuelve a nuestro{' '}
            <Link to="/HomePage" className="cart-empty-link">
              Home
            </Link>{' '}
          </p>
        </div>

        <h3 className="cart-empty-subtitle">
          O mira nuestros productos a continuación 🍔🍕😋
        </h3>

        <div className="cart-carousel-wrapper">
          <CarruselCategorias />
        </div>
      </div>
    </main>
  )
}

  return (
    <main className="cart-main">
      <h2>Mi Pedido</h2>
      <button onClick={() => navigate('/HomePage')} className="dp-back-btn">
        ← Volver
        </button>

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
