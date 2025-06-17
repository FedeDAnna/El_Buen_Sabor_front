import '../estilos/Sidebar.css';
function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><a href="/admin/stadisticas">Estadísticas</a></li>
        <li><a href="/admin/ordenes">Pedidos</a></li>
        <li><a href="/admin/categorias/1">Insumos</a></li>
        <li><a href="/admin/categorias/2">Productos</a></li>
        <li><a href="/admin/tipoPromociones">Tipo Promociones</a></li>
        <li><a href="/admin/sucursales">Sucursales</a></li>
        <li><a href="/HomePage">Home</a></li>
        
      </ul>
      <button className="logout">Cerrar Sesión</button>
    </nav>
  );
}
export default Sidebar;