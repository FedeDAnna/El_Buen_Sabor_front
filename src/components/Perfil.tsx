import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaUserTag, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import '../estilos/Perfil.css'; // opcional si no usás Tailwind

export default function Perfil() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  if (!user) return <p>Cargando...</p>;



  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/Homepage');
  };


  

  return (
    <div className="perfil-card">
      <h2 className="perfil-title"><FaUser style={{ marginRight: '0.5rem' }} /> Mi Perfil</h2>

      <div className="perfil-info">
        <p><FaUser /> <strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
        <p><FaEnvelope /> <strong>Email:</strong> {user.email}</p>
        <p><FaPhone /> <strong>Teléfono:</strong> {user.telefono}</p>
        <p><FaBirthdayCake /> <strong>Fecha de nacimiento:</strong> {new Date(user.fecha_nacimiento).toLocaleDateString()}</p>
        <p><FaUserTag /> <strong>Rol:</strong> {user.rol}</p>
      </div>

      <div className="perfil-botones">
        <button onClick={() => navigate('/historial')} className="perfil-btn btn-historial">
          <FaClipboardList /> Historial de Pedidos
        </button>
        <button onClick={cerrarSesion} className="perfil-btn btn-logout">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}