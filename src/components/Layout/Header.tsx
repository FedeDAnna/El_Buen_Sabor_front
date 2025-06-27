// src/components/Layout/Header.tsx
import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../../estilos/Header.css';
import { User, ClipboardList, LogOut, House } from 'lucide-react';
import { useCart, type CartItem } from '../CartContext';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Swal from 'sweetalert2';  
import { useNavigate } from 'react-router-dom';
//import { useUser } from '../../contexts/UserContext';



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
    Swal.fire({
      title: '¡Hasta Luego!',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      localStorage.removeItem('usuario');
      setUser(null);
      navigate('/Homepage');
      window.location.reload();
    });
    };
  return (
    
    <header className="header">
      
      <div
        className="titulo"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (user?.rol === 'CLIENTE') {
            navigate('/HomePage');
          } else {
            navigate('/admin/ordenes');
          }
        }}
      >
        EL BUEN SABOR
      </div>

      {/* Carrito solo para rol cliente */}
      {user?.rol  === 'CLIENTE' && (
        <div ref={cartRef} className="header-cart-container">
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
                                const id = item.kind === 'articulo'
                                  ? item.producto.id!
                                  : item.promocion.id!;
                                updateQuantity(id, item.kind, item.cantidad - 1);
                              }}
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                const id = item.kind === 'articulo'
                                  ? item.producto.id!
                                  : item.promocion.id!;
                                updateQuantity(id, item.kind, item.cantidad + 1);
                              }}
                            >
                              +
                            </button>
                            <button
                              onClick={() => {
                                const id = item.kind === 'articulo'
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
      )}

      {/* Perfil */}
      <div ref={profileRef}  className="header-profile-container">
        <button
          className="header-profile-btn"
          onClick={() => setProfileOpen(open => !open)}
          aria-label="Abrir menú de perfil"
        >
          {user?.imagen?.src ? (
            <img
              src={user.imagen.src}
              alt={user.imagen.alt || "Perfil"}
              className="header-profile-image"
            />
          ) : (
            <FaUserCircle size={28} />
          )}
          {user?.nombre && (
            <span className="header-profile-name">{user.nombre}</span>
          )}
        </button>


        {profileOpen && (
          <div className="header-profile-menu">
            {user ? (
              <>
                <h4>Mi Cuenta</h4>
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/perfil");
                      }}
                      className="profile-menu-btn"
                    >
                      <User size={20} /> Datos personales
                    </button>
                  </li>
                  <li>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/domicilios/1");
                    }}
                    className="profile-menu-btn"
                  >
                    <House size={20} /> Mis Domicilios
                  </button>
                </li>

                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/historial-pedidos");
                      }}
                      className="profile-menu-btn"
                    >
                      <ClipboardList size={20} /> Historial de pedidos
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        clearCart();
                        cerrarSesion();
                      }}
                      className="profile-menu-btn logout-btn"
                    >
                      <LogOut size={20} /> Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h4>Bienvenido</h4>
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/login");
                      }}
                      className="profile-menu-btn"
                    >
                      Iniciar Sesión
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/registro");
                      }}
                      className="profile-menu-btn"
                    >
                      Registrarme
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
