// src/components/ProductosCategoriaCliente.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../../estilos/ProductosCategoriaCliente.css'

import type Categoria from '../../entidades/Categoria'
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import type ArticuloInsumo from '../../entidades/ArticuloInsumo'

import CarruselCategorias from './CarruselCategorias'
import {
  fetchCategoriaById,
  getArticulosInsumoPorCategoria,
  getArticulosManufacturadoPorCategoria,
  getArticulosManufacturadosConInsumos
} from '../../services/FuncionesApi'

export default function ProductosCategoriaCliente() {
  const { categoriaId } = useParams<{ categoriaId: string }>()
  const [categoria, setCategoria] = useState<Categoria | undefined>()
  const [productos, setProductos] = useState<ArticuloManufacturado[] | ArticuloInsumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (categoriaId == null) return

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        let data: ArticuloManufacturado[] | ArticuloInsumo[] = []

        if (+categoriaId === 0) {
          // id=0: traemos todo (manufacturados + insumos no para elaborar)
          data = await getArticulosManufacturadosConInsumos()
          setCategoria(undefined)
        } else {
          // id≠0: por categoría
          const cat = await fetchCategoriaById(+categoriaId)
          setCategoria(cat)
          if (cat.tipo_categoria?.id === 1) {
            data = await getArticulosInsumoPorCategoria(cat.id!)
          } else {
            data = await getArticulosManufacturadoPorCategoria(cat.id!)
          }
        }

        setProductos(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los productos.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [categoriaId])

  // Narrowing de subtipos
  function isManufacturado(
    p: ArticuloManufacturado | ArticuloInsumo
  ): p is ArticuloManufacturado {
    return 'tiempo_estimado_en_minutos' in p
  }

  // Comprueba stock disponible sin error de "detalles" indefinido
  function hasStock(p: ArticuloManufacturado | ArticuloInsumo): boolean {
    if (!p) return false

    if (!isManufacturado(p)) {
      // Insumo: basta un único stock_insumo_sucursales[0]
      const sis = p.stock_insumo_sucursales?.[0]
      return !!sis && sis.stock_actual > 0
    }

    // Manufacturado: uniformizamos detalles a [] si viene undefined
    const detalles = p.detalles ?? []
    return detalles.every(d => {
      const sis = d.articulo_insumo?.stock_insumo_sucursales?.[0]
      return !!sis && sis.stock_actual >= d.cantidad
    })
  }

  // Filtro de búsqueda
  const productosFiltrados = productos.filter(p => {
    const term = searchTerm.toLowerCase()
    const denomMatch = p.denominacion.toLowerCase().includes(term)

    if (isManufacturado(p)) {
      const descMatch = p.descripcion?.toLowerCase().includes(term)
      return denomMatch || descMatch
    }
    return denomMatch
  })

  if (loading) return <p className="cpp-loading">Cargando productos…</p>
  if (error)   return <p className="cpp-error">{error}</p>

  return (
    <main className="cpp-main">
      <section className="cpp-carrusel-wrapper">
        <h2>Nuestras Categorías</h2>
        <CarruselCategorias />
      </section>

      <section className="cpp-content">
        <h2 className="cpp-title">
          {categoria?.denominacion || 'Todos los productos'}
        </h2>

        <div className="cpp-search-bar">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="cpp-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(prod => {
              const stockOk = hasStock(prod)
              const tipo = isManufacturado(prod) ? 'manufacturado' : 'insumo'

              return (
                <Link
                  key={prod.id}
                  to={`/articulo/${prod.id}`}
                  state={{ tipo, hasStock: stockOk }}
                  className={`cpp-card ${!stockOk ? 'no-stock' : ''}`}
                >
                  <div className="cpp-card-img">
                    {prod.imagen?.src
                      ? <img src={prod.imagen.src} alt={prod.denominacion}/>
                      : <div className="cpp-card-noimg">No hay imagen</div>
                    }
                  </div>
                  <div className="cpp-card-body">
                    <span className="cpp-card-name">{prod.denominacion}</span>
                    <span className="cpp-card-price">
                      ${prod.precio_venta.toLocaleString()}
                    </span>
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="cpp-no-results">No se encontraron resultados.</p>
          )}
        </div>
      </section>
    </main>
  )
}
