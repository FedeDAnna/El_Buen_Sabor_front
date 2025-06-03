
import ProductosTabla from './ProductosTabla';
import '../../estilos/Productos.css';
import { useCallback, useEffect, useState } from 'react';
import CategoriaModal from './CategoriaModal';
import { getCategoriasManufacturados, guardarCategoriaConHijos } from '../../services/FuncionesApi';
import type Categoria from '../../entidades/Categoria';

export default function Productos() {
  // 1) Estado de la lista aquí
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)

  // 2) Función para recargar las categorías
  const reload = useCallback(async () => {
    try {
      const data = await getCategoriasManufacturados()
      setCategorias(data)
    } catch (e) {
      console.error('No se pudieron cargar categorías:', e)
    }
  }, [])

  // 3) Al montar, carga inicial
  useEffect(() => {
    reload()
  }, [reload])

  // 4) Al salvar una nueva categoría, guardamos y recargamos
  const handleSave = async (cat: Categoria) => {
    try {
      console.log("ANTES")
      await guardarCategoriaConHijos(cat)
      // Después de guardar, recargamos la lista
      console.log("Guarda")
      await reload()
      console.log("Reload")
      
    } catch (e) {
      
      console.error(e)
      alert('Falló al guardar la categoría')
    } finally {
      setModalAbierto(false)
    }
  }

  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos</h2>
        <button className="btn-add" onClick={() => setModalAbierto(true)}>
          Agregar +
        </button>
      </div>

      {/* 5) Pasamos la lista ya cargada */}
      <ProductosTabla categorias={categorias} />

      {modalAbierto && (
        <CategoriaModal
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
        />
      )}
    </section>
  )
}