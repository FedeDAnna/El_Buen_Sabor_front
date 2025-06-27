import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarCliente from './SidebarCliente';
import '../../estilos/HomePage.css';
import CarruselCategorias from './CarruselCategorias';
import type TipoPromocion from '../../entidades/TipoPromocion';
import type Promocion from '../../entidades/Promocion';
import {
  getPromocionesPorTipoPromocion,
  getTiposPromociones,
} from '../../services/FuncionesApi';
import BuenSaborIcono from '../../assets/BuenSaborIcono.png';
import PromoCard from '../Promociones/PromoCard';
import { DateTime } from 'luxon';
import { useUser } from '../../contexts/UserContext';

const HamburgerIcon = () => (
  <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>
);

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const promoSectionRef = useRef<HTMLElement>(null);
  const [promoGroups, setPromoGroups] = useState<
    { tipo: TipoPromocion; promos: Promocion[] }[]
  >([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    getTiposPromociones()
      .then((tipos) =>
        Promise.all(
          tipos.map(async (tipo) => ({
            tipo,
            promos: await getPromocionesPorTipoPromocion(tipo.id!),
          }))
        )
      )
      .then(setPromoGroups)
      .catch(console.error);
  }, []);

  const handlePedirAhora = () => {
    if (user) {
      document
        .getElementById('categorias')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      heroRef.current?.classList.add('zoom-out');
      setTimeout(() => navigate('/login'), 600);
    }
  };

  const promoActiva = (p: Promocion) => {
    const ahora = DateTime.local();
    const desdeF = DateTime.fromJSDate(p.fecha_desde);
    const hastaF = DateTime.fromJSDate(p.fecha_hasta);
    if (ahora < desdeF.startOf('day') || ahora > hastaF.endOf('day'))
      return false;
    if (ahora < p.hora_desde || ahora > p.hora_hasta) return false;
    return true;
  };

  return (
    <>
      <button
        className="hp-hamburger-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <HamburgerIcon />
      </button>
      <SidebarCliente
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPromocionesClick={() => {
          promoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          setSidebarOpen(false);
        }}
      />

      {/* Hero full-bleed con video de YouTube */}
      <section className="hp-hero" ref={heroRef}>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/FPoTLc0ATX0?autoplay=1&mute=1&loop=1&controls=0&playlist=FPoTLc0ATX0&modestbranding=1"
            title="Video de fondo"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        <div className="hero-content">
          <img
            src={BuenSaborIcono}
            alt="El Buen Sabor"
            className="hp-hero-img"
          />
          <div className="hp-hero-text">
            <h1>El Buen Sabor</h1>
            <p>La mejor comida de tu vida está a un clic</p>
            <div className="hp-hero-buttons">
              <button
                className="hp-btn hp-btn-primary"
                onClick={handlePedirAhora}
              >
                {user ? 'Ver Categorías' : 'Iniciar Sesión'}
              </button>
              <Link to="/descargar-app" className="hp-btn hp-btn-secondary">
                Descargá la app
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="hp-main">
        <h2 id="categorias">Mira Nuestras Categorías</h2>
        <section className="hp-carrusel-wrapper">
          <CarruselCategorias />
        </section>

        <section ref={promoSectionRef}>
          <h2>Las Mejores Promociones 💲🍟🥓🍗</h2>
          {promoGroups.map(({ tipo, promos }) => {
            const activas = promos.filter(promoActiva);
            return (
              <div key={tipo.id} className="hp-promos-section">
                <h3 className="hp-promos-title">{tipo.descripcion}</h3>
                {activas.length > 0 ? (
                  <div className="hp-promos-grid">
                    {activas.map((p) => (
                      <PromoCard key={p.id} promo={p} />
                    ))}
                  </div>
                ) : (
                  <p className="hp-promos-empty">
                    Sin promociones disponibles en el horario/fecha actual.
                  </p>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
