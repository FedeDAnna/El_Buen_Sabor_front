import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../../estilos/Header.css';
import { User, ClipboardList, LogOut } from 'lucide-react';

const Header = () => {
   const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <button className="menu-btn">☰</button>
      <div className="titulo">EL BUEN SABOR</div>

      <div className="perfil-container">
        <button className="perfil-btn" onClick={() => setOpen(!open)}>
          <FaUserCircle size={28} />
        </button>

        {open && (
          <div className="menu-perfil">
            <h4>Mi Cuenta</h4>
            <ul>
              <li><User size={20} stroke="black" /> <span> Datos personales</span></li>
              <li><ClipboardList size={20} stroke="black" /> <span> Historial de pedidos</span></li>
              <li><LogOut size={20} stroke="black" /> <span> Cerrar sesión</span></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
