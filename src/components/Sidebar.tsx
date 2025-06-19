// Sidebar.tsx
import { GrRestaurant } from 'react-icons/gr';
import '../estilos/Sidebar.css';
import { FaChartBar, FaClipboardList, FaBoxOpen, FaCubes, FaGift, FaHome, FaSignOutAlt,FaUserFriends,FaUserTie  } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Sidebar() {
  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('usuario')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        const r = typeof u.rol === 'string'
          ? u.rol.trim().toLowerCase()
          : ''
        setRole(r)
      } catch {
        setRole('')
      }
    }
  }, [])
  const isAdmin = role === 'admin'
  const isCocinero = role === 'cocinero'
  const isCajero = role === 'cajero'
  const isDelivery = role === 'delivery' || role === 'repartidor'
  return (
    <nav className="sidebar">
      <ul>
        {/* Estadísticas: solo admin */}
        {isAdmin && (
          <li>
            <a href="/admin/estadisticas">
              <FaChartBar /> Estadísticas
            </a>
          </li>
        )}

        {/* Pedidos: admin, cocinero, cajero, delivery */}
        {(isAdmin || isCocinero || isCajero || isDelivery) && (
          <li>
            <a href="/admin/ordenes">
              <FaClipboardList /> Pedidos
            </a>
          </li>
        )}

        {/* Insumos: admin, cocinero */}
        {(isAdmin || isCocinero) && (
          <li>
            <a href="/admin/categorias/1">
              <FaCubes /> Insumos
            </a>
          </li>
        )}

        {/* Productos: admin, cocinero */}
        {(isAdmin || isCocinero) && (
          <li>
            <a href="/admin/categorias/2">
              <FaBoxOpen /> Productos
            </a>
          </li>
        )}

        {/* Tipo Promociones: admin, cocinero */}
        {(isAdmin || isCocinero) && (
          <li>
            <a href="/admin/tipoPromociones">
              <FaGift /> Tipo Promociones
            </a>
          </li>
        )}

        {/* Sucursales: solo admin */}
        {isAdmin && (
          <li>
            <a href="/admin/sucursales">
              <GrRestaurant /> Sucursales
            </a>
          </li>
        )}

        {/* Empleados: solo admin */}
        {isAdmin && (
          <li>
            <a href="/admin/empleados">
              <FaUserTie /> Empleados
            </a>
          </li>
        )}

        {/* Clientes: solo admin */}
        {isAdmin && (
          <li>
            <a href="/admin/clientes">
              <FaUserFriends /> Clientes
            </a>
          </li>
        )}

        {/* Home: admin, cocinero, cajero, delivery */}
        {(isAdmin || isCocinero || isCajero || isDelivery) && (
          <li>
            <a href="/HomePage">
              <FaHome /> Home
            </a>
          </li>
        )}
      </ul>

      <button className="logout">
        <FaSignOutAlt /> Cerrar Sesión
      </button>
    </nav>
  )
}

export default Sidebar;
