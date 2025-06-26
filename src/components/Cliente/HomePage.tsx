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
import { DateTime } from 'luxon'
const HamburgerIcon = () => <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>;

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const promoSectionRef = useRef<HTMLElement | null>(null)
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

  function promoActiva(p: Promocion) {
    const ahora = DateTime.local()
    // fechas
    const desdeF = DateTime.fromJSDate(p.fecha_desde)
    const hastaF = DateTime.fromJSDate(p.fecha_hasta)
    if (ahora < desdeF.startOf('day') || ahora > hastaF.endOf('day')) {
      return false
    }
    // horarios
    if (ahora < p.hora_desde || ahora > p.hora_hasta) {
      return false
    }
    return true
  }


  return (
    <>
      <button className="hp-hamburger-btn" onClick={() => setSidebarOpen(true)}>
        <HamburgerIcon />
      </button>

      <SidebarCliente isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}  onPromocionesClick={() => {
          promoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          setSidebarOpen(false)
        }}/>

      <main className="hp-main">
        <section className="hp-hero" ref={heroRef}>
          <img src={BuenSaborIcono} alt="El Buen Sabor" className="hp-hero-img" />
          <div className="hp-hero-text">
            <h1>El Buen Sabor</h1>
            <p>La mejor comida de tu vida está a un clic</p>
            <div className="hp-hero-buttons">
              
                <button className="hp-btn hp-btn-primary" onClick={handlePedirAhora}>
                  Iniciar Sesión
                </button>
              
              <Link to="/descargar-app" className="hp-btn hp-btn-secondary">
                Descargá la app
              </Link>
            </div>
          </div>
        </section>

        <h2>Mira Nuestras Categorías</h2>
        <section className="hp-carrusel-wrapper">
          <CarruselCategorias/>
        </section>

        <h2 >Las Mejores Promociones 💲🍟🥓🍗</h2>
        <section ref={promoSectionRef}>
        {promoGroups.map(({ tipo, promos }) => {
          const activas = promos.filter(promoActiva)

          return (
            <section key={tipo.id} className="hp-promos-section">
              <h2 className="hp-promos-title">{tipo.descripcion}</h2>
              {activas.length > 0 ? (
                <div className="hp-promos-grid">
                  {activas.map(p => (
                    <PromoCard key={p.id} promo={p} />
                  ))}
                </div>
              ) : (
                <p className="hp-promos-empty">
                  Sin promociones disponibles en el horario/fecha actual.
                </p>
              )}
            </section>
          )
        })}
        </section>
      </main>
    </>
  );
}
