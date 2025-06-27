import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../services/FuncionesApi';
import SidebarCliente from './SidebarCliente';
import BuenSaborIcono from '../../assets/BuenSaborIcono.png'; // imagen de hamburguesa grande
import { useUser } from '../../contexts/UserContext';
import '../../estilos/Login.css';
import Swal from 'sweetalert2';

const HamburgerIcon = () => (
  <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>
);

export default function Login() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser(); // ahora podés usar setUser(usuario)

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const usuario = await loginUsuario(email, password);
      localStorage.setItem("usuario", JSON.stringify(usuario)); 
      setUser(usuario); 
      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso.",
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/Homepage"); 
    } catch (error) {
      Swal.fire({                       // <- SweetAlert2 en Catch
        icon: "error",
        title: "Oops...",
        text: "Mail o contraseña incorrectos!",
        showConfirmButton: false,
        timer: 2000
      });
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
              alt="El Buen Sabor - ¡La mejor comida!"
              className="login-hero-img"
            />
          </div>

          <div className="login-form-section">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="login-form">
              <label>Email</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Clave"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="hp-btn hp-btn-primary">
                Ingresar
              </button>

              <p className="login-register-link">
                ¿No tenés cuenta? <a href="/registro">Registrate</a>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
