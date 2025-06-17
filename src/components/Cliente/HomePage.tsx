// src/components/HomePage/HomePage.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SidebarCliente from './SidebarCliente'
import '../../estilos/HomePage.css'
import CarruselCategorias from './CarruselCategorias'
import type TipoPromocion from '../../entidades/TipoPromocion'
import type Promocion from '../../entidades/Promocion'
import { getPromocionesPorTipoPromocion, getTiposPromociones, getArticuloManufacturadoById } from '../../services/FuncionesApi'
import BuenSaborIcono from '../../assets/BuenSaborIcono.png'   // <<– aquí
import PromoCard from '../Promociones/PromoCard'
import { DateTime } from 'luxon'

// Icono de hamburguesa (puedes cambiarlo por un SVG más bonito si quieres)
const HamburgerIcon = () => (
  <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>
)

export default function HomePage() {
  // Estado de sidebar abierto/cerrado
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const promoSectionRef = useRef<HTMLElement | null>(null)
  const [promoGroups, setPromoGroups] = useState<{ tipo: TipoPromocion; promos: Promocion[] }[]>([])

  useEffect(() => {
    getTiposPromociones()
      .then(tipos =>
        Promise.all(
          tipos.map(async tipo => ({
            tipo,
            promos: await getPromocionesPorTipoPromocion(tipo.id!),
          }))
        )
      )
      .then(setPromoGroups)
      .catch(console.error)
  }, [])

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
      {/* Botón hamburguesa siempre visible en el layout (por ejemplo en la esquina superior izquierda) */}
      <button
        className="hp-hamburger-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <HamburgerIcon />
      </button>

      <SidebarCliente isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}  onPromocionesClick={() => {
          promoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          setSidebarOpen(false)
        }}/>

      <main className="hp-main">
        {/* Hero section */}
        <section className="hp-hero">
          <img
            src={BuenSaborIcono}
            alt="El Buen Sabor - ¡La mejor comida!"
            className="hp-hero-img"
          />
          <div className="hp-hero-text">
            <h1>El Buen Sabor</h1>
            <p>La mejor comida de tu vida está a un clic</p>
            <div className="hp-hero-buttons">
              <Link to="/pedir" className="hp-btn hp-btn-primary">
                Pedí Ahora
              </Link>
              <Link to="/descargar-app" className="hp-btn hp-btn-secondary">
                Descargá la app
              </Link>
            </div>
          </div>
        </section>

        <h2>Mira Nuestras Categorias y Apurate a Pedir 😁🍗</h2>

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
  )
}
