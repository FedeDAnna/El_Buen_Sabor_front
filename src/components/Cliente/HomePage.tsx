// src/components/HomePage/HomePage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
//import Header from ''
//import Footer from ''
import SidebarCliente from './SidebarCliente'
import '../../estilos/HomaPage.css'
import CarruselCategorias from './CarruselCategorías'

export default function HomePage() {

  // Estado de sidebar abierto/cerrado
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  return (
    <>
        {/*<Header onMenuClick={() => setSidebarOpen(true)} />*/}
    
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
      </main>

    
    </>
  )
}
