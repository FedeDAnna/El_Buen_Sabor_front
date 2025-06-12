import React, { useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../../estilos/Header.css';
import { User, ClipboardList, LogOut } from 'lucide-react';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
   const [open, setOpen] = useState(false);
   const [profileOpen, setProfileOpen] = useState(false)

     // Estado para desplegar el mini‐menú del carrito
  const [cartOpen, setCartOpen] = useState(false)

  // Obtengo del contexto del carrito:
  const { cartItems, total } = useCart()


  return (
    <header className="header">
      
      <div className="titulo">EL BUEN SABOR</div>

      <div className="header-cart-container">
        <button
          className="header-cart-btn"
          onClick={() => setCartOpen(prev => !prev)}
          aria-label="Ver carrito"
        >
          <FaShoppingCart size={24} />
          {/* Muestro badge con cantidad total de ítems (suma de cantidades) */}
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
              <p className="empty-cart">No hay productos.</p>
            ) : (
              <ul className="cart-items-list">
                {cartItems.map(item => (
                  <li key={item.producto.id} className="cart-item">
                    <img
                      src={item.producto.imagen?.src || '/assets/no-image.png'}
                      alt={item.producto.denominacion}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <span className="cart-item-name">
                        {item.producto.denominacion}
                      </span>
                      <span className="cart-item-price">
                        ${item.producto.precio_venta.toLocaleString()} x {item.cantidad}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-menu-footer">
              <div className="cart-total">
                <span>Total:</span>{' '}
                <span className="cart-total-amount">
                  ${total.toLocaleString()}
                </span>
              </div>
              <Link to="/carrito" className="btn-view-cart" onClick={() => setCartOpen(false)}>
                Ver Carrito
              </Link>
            </div>
          </div>
        )}
      </div>      

      <div className="header-profile-container">
        <button
          className="header-profile-btn"
          onClick={() => setProfileOpen(prev => !prev)}
          aria-label="Abrir menú de perfil"
        >
          <FaUserCircle size={28} />
        </button>

        {profileOpen && (
          <div className="header-profile-menu">
            <h4>Mi Cuenta</h4>
            <ul>
              <li>
                <User size={20} stroke="black" />{' '}
                <span>Datos personales</span>
              </li>
              <li>
                <ClipboardList size={20} stroke="black" />{' '}
                <span>Historial de pedidos</span>
              </li>
              <li>
                <LogOut size={20} stroke="black" />{' '}
                <span>Cerrar sesión</span>
              </li>
            </ul>
          </div>
        )}
      </div>


    </header>
  );
};

export default Header;
