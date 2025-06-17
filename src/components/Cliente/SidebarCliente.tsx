// src/components/Layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom'
import '../../estilos/SidebarCliente.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onPromocionesClick: () => void
}

export default function SidebarCliente({ isOpen, onClose, onPromocionesClick }: SidebarProps) {
  const location = useLocation()

  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* El clic en el overlay cierra el sidebar */}
      <div
        className="sidebar"
        onClick={e => e.stopPropagation() /* evitar que el clic en el contenido cierre el sidebar */}
      >
        <button className="sb-close-btn" onClick={onClose}>
          ×
        </button>

        <nav className="sb-nav">
          <ul>
            <li>
              <Link
                to="/perfil/1"
                className={location.pathname.startsWith('/mi-cuenta') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">👤</span> Mis Datos
              </Link>
            </li>
            <li>
              <Link
                to="/historial"
                className={location.pathname.startsWith('/historial') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">📜</span> Historial de Pedidos
              </Link>
            </li>
            <li>
              <Link to="/cerrar-sesion" onClick={onClose}>
                <span className="sb-icon">🚪</span> Cerrar Sesión
              </Link>
            </li>
            <hr />
            <li>
              <button
                className="sb-link-btn"
                onClick={onPromocionesClick}
              >
                <span className="sb-icon">🏷️</span> Promociones
              </button>
            </li>
            <li>
              <Link
                to="/categorias/1"
                className={location.pathname.startsWith('/categorias') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">📦</span> Ver Productos
              </Link>
            </li>
            <hr />
            <li>
              <Link to="/nuestrasSucursales" onClick={onClose}>
                <span className="sb-icon">📍</span> Nuestras Sucursales
              </Link>
            </li>
            <li>
              <Link to="/quienes-somos" onClick={onClose}>
                <span className="sb-icon">👥</span> Quiénes Somos
              </Link>
            </li>
            <li>
              <Link to="/contacto" onClick={onClose}>
                <span className="sb-icon">✉️</span> Contacto
              </Link>
            </li>
            <hr />
            <li>
              <Link to="/faq" onClick={onClose}>
                <span className="sb-icon">❓</span> Preguntas Frecuentes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
