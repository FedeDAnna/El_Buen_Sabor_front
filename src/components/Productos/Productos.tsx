// src/components/ProductsPage/ProductsPage.tsx
import ProductosTabla from './ProductosTabla';
import '../../estilos/Productos.css';

export default function Productos() {
  return (
    <section className="products-page">
      <div className="header">
        <h2>Productos</h2>
        <button className="btn-add">Agregar +</button>
      </div>

      <ProductosTabla />
      
    </section>
  );
}
