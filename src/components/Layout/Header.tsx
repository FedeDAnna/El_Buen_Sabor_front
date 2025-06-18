// src/components/Layout/Header.tsx
import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../../estilos/Header.css';
import { User, ClipboardList, LogOut, House } from 'lucide-react';
import { useCart, type CartItem } from '../CartContext';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';



export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, setUser } = useUser();
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();

  const navigate = useNavigate();

  const cartRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // si el carrito está abierto y el click no fue dentro de cartRef, lo cerramos
      if (cartOpen && cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
      // idem para perfil
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, profileOpen]);
  
    const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/Homepage');
    };
  return (
    
    <header className="header">
      
      <div className="titulo">EL BUEN SABOR</div>

      {/* Carrito */}
      <div ref={cartRef}  className="header-cart-container">
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
                  // extraemos datos según el tipo
                  const key = item.kind === 'articulo'
                    ? `a-${item.producto.id}`
                    : `p-${item.promocion.id}`;

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
                              let id: number
                              if (item.kind === 'articulo') {
                                id = item.producto.id!
                              } else {
                                id = item.promocion.id!
                              }
                              updateQuantity(id, item.kind,item.cantidad - 1 )
                            }}
                          >
                            -
                          </button>
                          <button
                            onClick={() => {
                              let id: number
                              if (item.kind === 'articulo') {
                                id = item.producto.id!
                              } else {
                                id = item.promocion.id!
                              }
                              updateQuantity(id, item.kind,item.cantidad + 1 )
                            }}
                          >
                            +
                          </button>

                          <button
                            onClick={() => {
                              let id: number
                              if (item.kind === 'articulo') {
                                id = item.producto.id!
                              } else {
                                id = item.promocion.id!
                              }
                              removeFromCart(id, item.kind)
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
                <span className="cart-total-amount">
                  ${total}
                </span>
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
      <div ref={profileRef}  className="header-profile-container">
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
              <li>             
                <button
                  onClick={() => {
                    setProfileOpen(false); // cerrar el menú
                    navigate("/perfil");   // redirigir
                  }}
                  className="profile-menu-btn"
                >
                  <User size={20} /> Datos personales
                </button>
              </li>
              <li>
                <Link to={`/domicilios/1`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <House size={20} /> Mis Domicilios
                </Link>
              </li>
              <Link to="/historial-pedidos" className="menu-link">

              <li>
                <button
                  onClick={() => {
                    setProfileOpen(false); // cerrar el menú
                    navigate("/perfil");   // redirigir
                  }}
                  className="profile-menu-btn"
                >
                  <User size={20} /> Historial de pedidos
                </button>
              </li>
              </Link>
              <li>
                <button
                  onClick={() => {
                    setProfileOpen(false); // cerrar el menú
                    clearCart();
                    cerrarSesion();
                  }}
                  className="profile-menu-btn logout-btn"
                >
                  <User size={20} /> Cerrar Sesion
                </button>
              </li>
            </ul>

          </div>
        )}
      </div>
    </header>
  );
}
