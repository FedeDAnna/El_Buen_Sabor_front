// Sidebar.tsx
import '../estilos/Sidebar.css';
import { FaChartBar, FaClipboardList, FaBoxOpen, FaCubes, FaGift, FaHome, FaSignOutAlt,FaUserFriends,FaUserTie  } from 'react-icons/fa';

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><a href="/admin/estadisticas"><FaChartBar /> Estadísticas</a></li>
        <li><a href="/admin/ordenes"><FaClipboardList /> Pedidos</a></li>
        <li><a href="/admin/categorias/1"><FaCubes /> Insumos</a></li>
        <li><a href="/admin/categorias/2"><FaBoxOpen /> Productos</a></li>
        <li><a href="/admin/tipoPromociones"><FaGift /> Tipo Promociones</a></li>
        <li><a href="/admin/empleados"><FaUserTie /> Empleados</a></li>
        <li><a href="/admin/clientes"><FaUserFriends  /> Clientes</a></li>
        <li><a href="/HomePage"><FaHome /> Home</a></li>
      </ul>
      <button className="logout"><FaSignOutAlt /> Cerrar Sesión</button>
    </nav>
  );
}

export default Sidebar;
