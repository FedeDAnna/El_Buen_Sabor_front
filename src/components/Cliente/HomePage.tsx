import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarCliente from './SidebarCliente';
import '../../estilos/HomePage.css';
import CarruselCategorias from './CarruselCategorias';
import type TipoPromocion from '../../entidades/TipoPromocion';
import type Promocion from '../../entidades/Promocion';
import { getPromocionesPorTipoPromocion, getTiposPromociones } from '../../services/FuncionesApi';
import BuenSaborIcono from '../../assets/BuenSaborIcono.png';
import PromoCard from '../Promociones/PromoCard';

const HamburgerIcon = () => <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>;

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promoGroups, setPromoGroups] = useState<{ tipo: TipoPromocion; promos: Promocion[] }[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTiposPromociones()
      .then(tipos =>
        Promise.all(tipos.map(async tipo => ({
          tipo,
          promos: await getPromocionesPorTipoPromocion(tipo.id!)
        })))
      )
      .then(setPromoGroups)
      .catch(console.error);
  }, []);

  const handlePedirAhora = () => {
    if (heroRef.current) {
      heroRef.current.classList.add('zoom-out');
    }
    setTimeout(() => navigate('/login'), 600); // debe coincidir con la duración de la animación CSS
  };

  return (
    <>
      <button className="hp-hamburger-btn" onClick={() => setSidebarOpen(true)}>
        <HamburgerIcon />
      </button>

      <SidebarCliente isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="hp-main">
        <section className="hp-hero" ref={heroRef}>
          <img src={BuenSaborIcono} alt="El Buen Sabor" className="hp-hero-img" />
          <div className="hp-hero-text">
            <h1>El Buen Sabor</h1>
            <p>La mejor comida de tu vida está a un clic</p>
            <div className="hp-hero-buttons">
              <button className="hp-btn hp-btn-primary" onClick={handlePedirAhora}>
                Pedí Ahora
              </button>
              <Link to="/descargar-app" className="hp-btn hp-btn-secondary">
                Descargá la app
              </Link>
            </div>
          </div>
        </section>

        <h2>Mira Nuestras Categorías</h2>
        <section className="hp-carrusel-wrapper">
          <CarruselCategorias />
        </section>

        <h2>Las Mejores Promociones</h2>
        {promoGroups.map(({ tipo, promos }) => (
          <section key={tipo.id} className="hp-promos-section">
            <h2 className="hp-promos-title">{tipo.descripcion}</h2>
            <div className="hp-promos-grid">
              {promos.map(p => (
                <PromoCard key={p.id} promo={p} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
