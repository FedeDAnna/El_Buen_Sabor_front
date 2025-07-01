// src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react'
import {
  FaChartBar, FaClipboardList, FaBoxOpen, FaCubes,
  FaGift, FaHome, FaSignOutAlt, FaUserFriends, FaUserTie
} from 'react-icons/fa'
import { GrRestaurant } from 'react-icons/gr'
import '../estilos/Sidebar.css'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const [role, setRole] = useState('')
  useEffect(() => {
    const stored = localStorage.getItem('usuario')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setRole(typeof u.rol === 'string' ? u.rol.trim().toLowerCase() : '')
      } catch {}
    }
  }, [])

  const isAdmin    = role === 'admin'
  const isCocinero = role === 'cocinero'
  const isCajero   = role === 'cajero'
  const isDelivery = role === 'delivery' || role === 'repartidor'

  return (
    <nav className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        {isAdmin && <li><a href="/admin/estadisticas"><FaChartBar/> Estadísticas</a></li>}
        {(isAdmin||isCocinero||isCajero||isDelivery) &&
          <li><a href="/admin/ordenes"><FaClipboardList/> Pedidos</a></li>}
        {(isAdmin||isCocinero) && <>
          <li><a href="/admin/categorias/1"><FaCubes/> Insumos</a></li>
          <li><a href="/admin/categorias/2"><FaBoxOpen/> Productos</a></li>
          <li><a href="/admin/tipoPromociones"><FaGift/> Tipo Promociones</a></li>
        </>}
        {isAdmin && <>
          <li><a href="/admin/sucursales"><GrRestaurant/> Sucursales</a></li>
          <li><a href="/admin/empleados"><FaUserTie/> Empleados</a></li>
          <li><a href="/admin/clientes"><FaUserFriends/> Clientes</a></li>
        </>}
        
      </ul>
      {/* <button
        className="admin-logout-btn"
        onClick={onClose}          // aquí cierras el sidebar
      >

        <FaSignOutAlt/> Cerrar Sesión
      </button> */}
    </nav>
  )
}
