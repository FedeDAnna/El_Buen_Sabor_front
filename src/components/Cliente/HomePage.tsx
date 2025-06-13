// src/components/HomePage/HomePage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SidebarCliente from './SidebarCliente'
import '../../estilos/HomePage.css'
import CarruselCategorias from './CarruselCategorias'
import type TipoPromocion from '../../entidades/TipoPromocion'
import type Promocion from '../../entidades/Promocion'
import { getPromocionesPorTipoPromocion, getTiposPromociones } from '../../services/FuncionesApi'

// Icono de hamburguesa (puedes cambiarlo por un SVG más bonito si quieres)
const HamburgerIcon = () => (
  <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>☰</span>
)

export default function HomePage() {
  // Estado de sidebar abierto/cerrado
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [promoGroups, setPromoGroups] = useState<
    { tipo: TipoPromocion; promos: Promocion[] }[]
  >([])

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

  return (
    <>
      {/* Botón hamburguesa siempre visible en el layout (por ejemplo en la esquina superior izquierda) */}
      <button
        className="hp-hamburger-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <HamburgerIcon />
      </button>

      <SidebarCliente isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="hp-main">
        {/* Hero section */}
        <section className="hp-hero">
          <img
            src="/assets/hero-hamburguesa.jpg"
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

        <section className="hp-carrusel-wrapper">
          <CarruselCategorias />
        </section>

        {promoGroups.map(({ tipo, promos }) => (
          <section key={tipo.id} className="hp-promos-section">
            <h2 className="hp-promos-title">{tipo.descripcion}</h2>
            <div className="hp-promos-grid">
              {promos.map(p => (
                <Link
                  key={p.id}
                  to={`/promociones/${p.id}`}
                  className="hp-promo-card"
                >
                  {p.imagen?.src ? (
                    <img
                      src={p.imagen.src}
                      alt={p.denominacion}
                      className="hp-promo-img"
                    />
                  ) : (
                    <div className="hp-promo-noimg">Sin imagen</div>
                  )}
                  <div className="hp-promo-body">
                    <strong>{p.denominacion}</strong>
                    <p className="hp-promo-desc">
                      {p.descripcion_descuento}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
