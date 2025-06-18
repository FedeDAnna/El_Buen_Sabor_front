// src/components/Layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom'
import '../../estilos/SidebarCliente.css'
import { useEffect, useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onPromocionesClick: () => void
}

export default function SidebarCliente({ isOpen, onClose, onPromocionesClick }: SidebarProps) {
  const location = useLocation()
   // 1️⃣ Leemos y normalizamos el rol
  const [userRole, setUserRole] = useState<string>('')
  useEffect(() => {
    const stored = localStorage.getItem('usuario')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        const rol = typeof u.rol === 'string'
          ? u.rol.trim().toLowerCase()
          : ''
        setUserRole(rol)
      } catch {
        setUserRole('')
      }
    }
  }, [])

  // 2️⃣ Roles que pueden ver el Dash Board
  const rolesConDashboard = ['admin', 'cocinero', 'cajero', 'delivery']

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
            {rolesConDashboard.includes(userRole) && (
              <li>
                <Link
                  to="/admin/Ordenes"
                  className={location.pathname.startsWith('/dashboard') ? 'active' : ''}
                  onClick={onClose}
                >
                  <span className="sb-icon">📊</span> Dash Board
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/perfil"
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
