import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
//import Header from '../Layout/Header'
//import Footer from '../Layout/Footer'
import '../../estilos/ProductosCategoriaCliente.css'
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import { fetchCategoriaById, getArticulosInsumoPorCategoria, getArticulosManufacturadoPorCategoria, getArticulosManufacturados } from '../../services/FuncionesApi'
import CarruselCategorias from './CarruselCategorias'
import type Categoria from '../../entidades/Categoria'
import type ArticuloInsumo from '../../entidades/ArticuloInsumo'

export default function ProductosCategoriaCliente() {
  const { categoriaId } = useParams<{ categoriaId: string }>()
  const [categoria, setCategoria] = useState<Categoria>();
  
  // Productos que vienen del backend
  const [productos, setProductos] = useState<ArticuloManufacturado[]|ArticuloInsumo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Control del buscador
  const [searchTerm, setSearchTerm] = useState<string>('')
   
 useEffect(() => {
    if (!categoriaId) return

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        let data:
          | ArticuloManufacturado[]
          | ArticuloInsumo[] = []

        if(Number(categoriaId) != 0){
          const cat = await fetchCategoriaById(Number(categoriaId))
          setCategoria(cat)
          if(cat.tipo_categoria?.id === 1){
            data = await getArticulosInsumoPorCategoria(cat.id!)
          }else {
          data = await getArticulosManufacturadoPorCategoria(cat.id!)
          }
        }else{
          data = await getArticulosManufacturados()
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

  console.log("Productos", productos)

  function isManufacturado(
    p: ArticuloManufacturado | ArticuloInsumo
  ): p is ArticuloManufacturado {
    return 'tiempo_estimado_en_minutos' in p
  }

  // Filtrar productos según searchTerm (por denominacion o descripcion, toLowerCase)
  const productosFiltrados = productos.filter(p => {
    const term = searchTerm.toLowerCase();
    const denomMatch = p.denominacion.toLowerCase().includes(term);

    if (isManufacturado(p)) {
      // aquí p es ArticuloManufacturado => tiene .descripcion
      const descMatch = p.descripcion.toLowerCase().includes(term);
      return denomMatch || descMatch;
    } else {
      // aquí p es ArticuloInsumo => sólo .denominacion
      return denomMatch;
    }
  });

  console.log()

  return (
    <>
      <main className="cpp-main">
        {/* Carrusel siempre en la parte superior */}
        <section className="cpp-carrusel-wrapper">
          <CarruselCategorias />
        </section>

        <section className="cpp-content">
          <h2 className="cpp-title">
            {categoria?.denominacion ? categoria?.denominacion : 'Productos'}
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
                    state={{ tipo: (isManufacturado(prod) ? 'manufacturado' : 'insumo') }}
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
        <br></br>
        <br></br>
      </main>
    </>
  )
}
