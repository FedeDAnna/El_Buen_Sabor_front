import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarCliente from './SidebarCliente';
import { registrarUsuario } from '../../services/FuncionesApi';
import BuenSaborIcono from '../../assets/BuenSaborIcono.png';
import '../../estilos/Login.css'; // reutilizamos los estilos del login

const HamburgerIcon = () => (
  <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>
);

export default function Register() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await registrarUsuario({
        nombre,
        apellido,
        telefono,
        email,
        fecha_nacimiento: fechaNacimiento,
        password,        
      });

      alert('Registro exitoso');
      navigate('/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <button className="hp-hamburger-btn" onClick={() => setSidebarOpen(true)}>
        <HamburgerIcon />
      </button>

      <SidebarCliente
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onPromocionesClick={() => {navigate("/promociones");}}
            />

      <main className="hp-main login-main">
        <section className="login-hero">
          <div className="login-image-wrapper">
            <img
              src={BuenSaborIcono}
              alt="Comida registro"
              className="login-hero-img"
            />
          </div>

          <div className="login-form-section">
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
              <input
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Repetir Contraseña"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              <button type="submit" className="hp-btn hp-btn-primary">
                Registrarme
              </button>

              <p className="login-register-link">
                ¿Ya tenés cuenta? <a href="/login">Iniciá sesión</a>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
