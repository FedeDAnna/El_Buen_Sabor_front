// src/components/ProductsPage/ProductsPage.tsx
import ProductosTabla from './ProductosTabla';
import '../../estilos/Productos.css';
import { useState } from 'react';
import CategoriaModal from './CategoriaModal';
import { guardarCategoriaConHijos } from '../../services/FuncionesApi';
import type Categoria from '../../entidades/Categoria';

export default function Productos() {
  const [modalAbierto, setModalAbierto] = useState(false)

  const handleSave = async (cat: Categoria) => {
    try {
      const creada = await guardarCategoriaConHijos(cat)
      console.log('Guardado:', creada)
      // recarga o muestra feedback…
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
      <ProductosTabla />
      {modalAbierto && (
        <CategoriaModal
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
        />
      )}
    </section>
  )
}
