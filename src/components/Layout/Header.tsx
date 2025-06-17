import { useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { User, ClipboardList, LogOut } from 'lucide-react';
import { useCart } from '../CartContext';
import '../../estilos/Header.css';
import { useAuth0 } from '@auth0/auth0-react';

// Botón Login
function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>;
}

// Botón Logout con redirección al HomePage
function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: `${window.location.origin}/HomePage`,
          },
        })
      }
    >
      <LogOut size={20} /> Cerrar sesión
    </button>
  );
}

// Botón Perfil
function ProfileButton() {
  const { user } = useAuth0();
  return (
    <div className="profile-info">
      <User size={20} /> {user?.name || user?.email}
    </div>
  );
}

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated } = useAuth0();
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();

  return (
    <header className="header">
      <div className="titulo">EL BUEN SABOR</div>

      {/* Carrito */}
      <div className="header-cart-container">
        <button
          className="header-cart-btn"
          onClick={() => setCartOpen(open => !open)}
          aria-label="Ver carrito"
        >
          <FaShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.reduce((sum, it) => sum + it.cantidad, 0)}
            </span>
          )}
        </button>

        {cartOpen && (
          <div className="header-cart-menu">
            <h4>Carrito</h4>
            {cartItems.length === 0 ? (
              <p className="empty-cart">No hay items.</p>
            ) : (
              <ul className="cart-items-list">
                {cartItems.map(item => {
                  const key =
                    item.kind === 'articulo'
                      ? `a-${item.producto.id}`
                      : `p-${item.promocion.id}`;

                  const src =
                    item.kind === 'articulo'
                      ? item.producto.imagen?.src
                      : item.promocion.imagen?.src;

                  const name =
                    item.kind === 'articulo'
                      ? item.producto.denominacion
                      : item.promocion.denominacion;

                  const price =
                    item.kind === 'articulo'
                      ? item.producto.precio_venta
                      : item.promocion.precio_promocional;

                  return (
                    <li key={key} className="cart-item">
                      <img
                        src={src || '/assets/no-image.png'}
                        alt={name}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <span className="cart-item-name">{name}</span>
                        <span className="cart-item-price">
                          ${price} × {item.cantidad}
                        </span>
                        <div className="cart-item-controls">
                          <button
                            onClick={() => {
                              const id =
                                item.kind === 'articulo'
                                  ? item.producto.id!
                                  : item.promocion.id!;
                              updateQuantity(id, item.kind, item.cantidad - 1);
                            }}
                          >
                            -
                          </button>
                          <button
                            onClick={() => {
                              const id =
                                item.kind === 'articulo'
                                  ? item.producto.id!
                                  : item.promocion.id!;
                              updateQuantity(id, item.kind, item.cantidad + 1);
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              const id =
                                item.kind === 'articulo'
                                  ? item.producto.id!
                                  : item.promocion.id!;
                              removeFromCart(id, item.kind);
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="cart-menu-footer">
              <div className="cart-total">
                <span>Total:</span>{' '}
                <span className="cart-total-amount">${total}</span>
              </div>
              <Link
                to="/carrito"
                className="btn-view-cart"
                onClick={() => setCartOpen(false)}
              >
                Ver Carrito
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Perfil */}
      <div className="header-profile-container">
        <button
          className="header-profile-btn"
          onClick={() => setProfileOpen(open => !open)}
          aria-label="Abrir menú de perfil"
        >
          <FaUserCircle size={28} />
        </button>

        {profileOpen && (
          <div className="header-profile-menu">
            <h4>Mi Cuenta</h4>
            <ul>
              {isAuthenticated ? (
                <>
                  <li><ProfileButton /></li>
                  <Link to="/historial-pedidos" className="menu-link">
                    <li><ClipboardList size={20} /> Historial de pedidos</li>
                  </Link>
                  <li><LogoutButton /></li>
                </>
              ) : (
                <li><LoginButton /></li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
