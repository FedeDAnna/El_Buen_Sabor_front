// src/components/CarruselCategorias/CarruselCategorias.tsx
import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../estilos/CarruselCategorias.css'
import type Categoria from '../../entidades/Categoria'
import { findCategoriaParaVentas, getCategoriasByTipo } from '../../services/FuncionesApi'

interface Props {
  onCategoryClick?: (cat: Categoria) => void
}

export default function CarruselCategorias({ onCategoryClick }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState<number>(0)
  const location = useLocation()

  useEffect(() => {
    // Cargar categorías al montar
    findCategoriaParaVentas()
      .then(data => setCategorias(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="cc-loading">Cargando categorías...</div>
  }

  // Determinar si "Todos" está activo (ruta termina en /categorias/0)
  const todosActive = location.pathname.endsWith('/categorias/0')

  const scrollLeft = () => {
    if (!carouselRef.current) return
    const newPos = Math.max(scrollPos - 200, 0)
    setScrollPos(newPos)
    carouselRef.current.scrollTo({ left: newPos, behavior: 'smooth' })
  }
  
  const scrollRight = () => {
    if (!carouselRef.current) return
    const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    const newPos = Math.min(scrollPos + 200, maxScroll)
    setScrollPos(newPos)
    carouselRef.current.scrollTo({ left: newPos, behavior: 'smooth' })
  }

  return (
    <div className="cc-container">
      <button className="cc-arrow cc-left" onClick={scrollLeft} aria-label="Anterior">
        ←
      </button>
      <div className="cc-carousel" ref={carouselRef}>
        {/* Primer elemento: "Todos" con id=0 */}
        {onCategoryClick ? (
          <div
            key={0}
            className={`cc-item ${todosActive ? 'active' : ''}`}
            onClick={() => onCategoryClick({ id: 0, denominacion: 'Todos' } as Categoria)}
          >
            <div className="cc-icon">T</div>
            <span className="cc-name">Todos</span>
          </div>
        ) : (
          <Link
            key={0}
            to="/categorias/0"
            className={`cc-item ${todosActive ? 'active' : ''}`}
          >
            <div className="cc-icon">T</div>
            <span className="cc-name">Todos</span>
          </Link>
        )}

        {/* Resto de categorías */}
        {categorias.map(cat => {
          const isActive = location.pathname.endsWith(`/categorias/${cat.id}`)

          if (onCategoryClick) {
            return (
              <div
                key={cat.id}
                className={`cc-item ${isActive ? 'active' : ''}`}
                onClick={() => onCategoryClick(cat)}
              >
                <div className="cc-icon">
                  {cat.denominacion.charAt(0).toUpperCase()}
                </div>
                <span className="cc-name">{cat.denominacion}</span>
              </div>
            )
          } else {
            return (
              <Link
                key={cat.id}
                to={`/categorias/${cat.id}`}
                className={`cc-item ${isActive ? 'active' : ''}`}
              >
                <div className="cc-icon">
                  {cat.denominacion.charAt(0).toUpperCase()}
                </div>
                <span className="cc-name">{cat.denominacion}</span>
              </Link>
            )
          }
        })}
      </div>
      <button className="cc-arrow cc-right" onClick={scrollRight} aria-label="Siguiente">
        →
      </button>
    </div>
  )
}
