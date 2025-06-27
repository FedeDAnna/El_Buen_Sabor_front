// src/components/Layout/Sidebar.tsx

import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../estilos/SidebarCliente.css'
import { useEffect, useState } from 'react'
import { useUser } from '../../contexts/UserContext';
import Swal from 'sweetalert2';
import { LiaWonSignSolid } from 'react-icons/lia';

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onPromocionesClick: () => void
}

export default function SidebarCliente({ isOpen, onClose, onPromocionesClick }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate();
   // 1️⃣ Leemos y normalizamos el rol
  const { user, setUser } = useUser();
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

  const cerrarSesion = () => {
    Swal.fire({
      title: 'Sesión cerrada',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).then(() => {
      localStorage.removeItem('usuario');
      setUser(null);
      navigate('/Homepage');
      window.location.reload();
    });
    };

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

            {user ? 
            <>
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
                <Link to="/HomePage" onClick={cerrarSesion}>
                  <span className="sb-icon">🚪</span> Cerrar Sesión
                </Link>
              </li>
            </>
            :
            <li>
              <Link to="/login">
                <span className="sb-icon">🚪</span> Iniciar Sesión
              </Link>
            </li>
            }
            
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
                to="/categorias/0"
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
