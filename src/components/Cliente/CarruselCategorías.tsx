// src/components/CarruselCategorias/CarruselCategorias.tsx
import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../estilos/CarruselCategorias.css'
import type Categoria from '../../entidades/Categoria'
import { getCategoriasByTipo } from '../../services/FuncionesApi'

interface Props {
  /** Si se quiere remapear el clic para algo distinto, 
      se puede pasar onCategoryClick en lugar de Link por defecto */
  onCategoryClick?: (cat: Categoria) => void
}

export default function CarruselCategorias({ onCategoryClick }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState<number>(0)
  const location = useLocation()

  useEffect(() => {
    getCategoriasByTipo(2)
      .then(data => setCategorias(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

  if (loading) {
    return <div className="cc-loading">Cargando categorías...</div>
  }

  return (
    <div className="cc-container">
      <button className="cc-arrow cc-left" onClick={scrollLeft} aria-label="Anterior">
        ←
      </button>
      <div className="cc-carousel" ref={carouselRef}>
        {categorias.map(cat => {
          // Determinar si la ruta actual ya es de esta categoría, para subrayar o resaltar
          const isActive = location.pathname.endsWith(`/categorias/${cat.id}`)

          // Si se pasa onCategoryClick, llamarlo; sino usamos Link por defecto
          if (onCategoryClick) {
            return (
              <div
                key={cat.id}
                className={`cc-item ${isActive ? 'active' : ''}`}
                onClick={() => onCategoryClick(cat)}
              >
                <div className="cc-icon">
                  {/* Placeholder de ícono: primera letra mayúscula */}
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
