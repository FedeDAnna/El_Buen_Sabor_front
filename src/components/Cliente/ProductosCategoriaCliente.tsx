// src/components/CategoriaProductosPage/CategoriaProductosPage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
//import Header from '../Layout/Header'
//import Footer from '../Layout/Footer'
import '../../estilos/ProductosCategoriaCliente.css'
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import { fetchCategoriaById, getArticulosManufacturadoPorCategoria } from '../../services/FuncionesApi'
import CarruselCategorias from './CarruselCategorías'
import type Categoria from '../../entidades/Categoria'

export default function ProductosCategoriaCliente() {
  const { categoriaId } = useParams<{ categoriaId: string }>()
  const [categoria, setCategoria] = useState<Categoria>();
  
  // Productos que vienen del backend
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Control del buscador
  const [searchTerm, setSearchTerm] = useState<string>('')

 useEffect(() => {
     if (!categoriaId) return;
     fetchCategoriaById(Number(categoriaId))
       .then(setCategoria)
       .catch((e) => console.error(e));
}, [categoriaId]);
  
  
  useEffect(() => {
    if (!categoriaId) return
    setLoading(true)
    setError(null)

    getArticulosManufacturadoPorCategoria(Number(categoriaId))
      .then(data => {
        setProductos(data)
      })
      .catch(err => {
        console.error(err)
        setError('No se pudieron cargar los productos.')
      })
      .finally(() => setLoading(false))
  }, [categoriaId])

  // Filtrar productos según searchTerm (por denominacion o descripcion, toLowerCase)
  const productosFiltrados = productos.filter(p => {
    const term = searchTerm.toLowerCase()
    return (
      p.denominacion.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    )
  })

  return (
    <>
      {/*<Header onMenuClick={() => setSidebarOpen(true)} />*/}
      

      <main className="cpp-main">
        {/* Carrusel siempre en la parte superior */}
        <section className="cpp-carrusel-wrapper">
          <CarruselCategorias />
        </section>

        <section className="cpp-content">
          <h2 className="cpp-title">
            {categoria?.denominacion ? categoria?.denominacion : 'Categoria'}
          </h2>

          <div className="cpp-search-bar">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p className="cpp-loading">Cargando productos…</p>}
          {error && <p className="cpp-error">{error}</p>}

          {!loading && !error && (
            <div className="cpp-grid">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(prod => (
                  <Link
                    key={prod.id}
                    to={`/articulo/${prod.id}`}
                    className="cpp-card"
                  >
                    <div className="cpp-card-img">
                      {prod.imagen?.src ? (
                        <img src={prod.imagen.src} alt={prod.imagen.alt || prod.denominacion} />
                      ) : (
                        <div className="cpp-card-noimg">No hay imagen</div>
                      )}
                    </div>
                    <div className="cpp-card-body">
                      <span className="cpp-card-name">{prod.denominacion}</span>
                      <span className="cpp-card-price">${prod.precio_venta.toLocaleString()}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="cpp-no-results">No se encontraron resultados.</p>
              )}
            </div>
          )}
        </section>
        <div>
        <Link to="/HomePage" className="btn-add">
          ← Volver
        </Link>
        </div>
      </main>

      {/*<Footer />*/}
    </>
  )
}
