// src/components/Layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom'
import '../../estilos/SidebarCliente.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
                to="/mi-cuenta"
                className={location.pathname.startsWith('/mi-cuenta') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">👤</span> Mis Datos
              </Link>
            </li>
            <li>
              <Link
                to="/historial-pedidos"
                className={location.pathname.startsWith('/historial-pedidos') ? 'active' : ''}
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
              <Link
                to="/promociones"
                className={location.pathname.startsWith('/promociones') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">🏷️</span> Promociones
              </Link>
            </li>
            <li>
              <Link
                to="/categorias/0"
                className={location.pathname.startsWith('/categorias') ? 'active' : ''}
                onClick={onClose}
              >
                <span className="sb-icon">📦</span> Ver Productos
              </Link>
            </li>
            <hr />
            <li>
              <Link to="/locales" onClick={onClose}>
                <span className="sb-icon">📍</span> Locales
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
