// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { User, ClipboardList, LogOut } from 'lucide-react';
import { useCart, type CartItem } from '../CartContext';
import '../../estilos/Header.css';
import { useAuth0 } from '@auth0/auth0-react';

// Botón de Login
function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <button className="profile-menu-btn" onClick={() => loginWithRedirect()}>
      Iniciar sesión
    </button>
  );
}

// Botón de Logout (redirige al HomePage)
function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button
      className="profile-menu-btn logout-btn"
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

// Botón de Perfil
function ProfileInfo() {
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
  const { isAuthenticated, user } = useAuth0();
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // calcula badge del carrito
  const itemCount = cartItems.reduce((sum, it) => sum + it.cantidad, 0);

  return (
    <header className="header">
      <div className="titulo">EL BUEN SABOR</div>

      {/* Carrito */}
      {isAuthenticated && (user?.['https://your-app.com/roles'] || []).includes('CLIENTE') && (
        <div className="header-cart-container">
          <button
            className="header-cart-btn"
            onClick={() => setCartOpen(open => !open)}
            aria-label="Ver carrito"
          >
            <FaShoppingCart size={24} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {cartOpen && (
            <div className="header-cart-menu">
              <h4>Carrito</h4>
              {cartItems.length === 0 ? (
                <p className="empty-cart">No hay items.</p>
              ) : (
                <ul className="cart-items-list">
                  {cartItems.map((item: CartItem) => {
                    const id = item.kind === 'articulo'
                      ? item.producto.id!
                      : item.promocion.id!;
                    const src = item.kind === 'articulo'
                      ? item.producto.imagen?.src
                      : item.promocion.imagen?.src;
                    const name = item.kind === 'articulo'
                      ? item.producto.denominacion
                      : item.promocion.denominacion;
                    const price = item.kind === 'articulo'
                      ? item.producto.precio_venta
                      : item.promocion.precio_promocional;

                    return (
                      <li key={`${item.kind}-${id}`} className="cart-item">
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
                            <button onClick={() => updateQuantity(id, item.kind, item.cantidad - 1)}>-</button>
                            <button onClick={() => updateQuantity(id, item.kind, item.cantidad + 1)}>+</button>
                            <button onClick={() => removeFromCart(id, item.kind)}>🗑️</button>
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
      )}

      {/* Perfil */}
      <div className="header-profile-container">
        <button
          className="header-profile-btn"
          onClick={() => setProfileOpen(o => !o)}
          aria-label="Abrir menú de perfil"
        >
          {isAuthenticated && user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="header-profile-image"
            />
          ) : (
            <FaUserCircle size={28} />
          )}
        </button>

        {profileOpen && (
          <div className="header-profile-menu">
            <h4>Mi Cuenta</h4>
            <ul>
              {isAuthenticated ? (
                <>
                  <li>
                    <button
                      className="profile-menu-btn"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/perfil');
                      }}
                    >
                      <User size={20} /> Datos personales
                    </button>
                  </li>
                  <li>
                    <Link to="/historial-pedidos" className="profile-menu-btn menu-link">
                      <ClipboardList size={20} /> Historial de pedidos
                    </Link>
                  </li>
                  <li><ProfileInfo /></li>
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
