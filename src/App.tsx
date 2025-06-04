// src/App.tsx
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPantalla from '../src/components/AdminPantalla'
import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';
import Layout from './components/Layout/Layout';
import HomePage from './components/Cliente/HomePage';
import ProductosCategoriaCliente from './components/Cliente/ProductosCategoriaCliente';
import ProductoEnDetalleCliente from './components/Cliente/ProductoEnDetalleCliente';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/HomePage" replace />} />

        <Route path="/HomePage" element={<HomePage />} />

        <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />

        <Route path="/articulo/:id" element={<ProductoEnDetalleCliente/>} />
        
          <Route
            path="/admin/productos"
            element={
              <AdminPantalla>
                <Productos />
              </AdminPantalla>
            }
          />

          <Route
            path="/admin/productos/:categoriaId"
            element={
              <AdminPantalla>
                <ProductosCategoria />
              </AdminPantalla>
            }
          />

          <Route path="*" element={<p>Página no encontrada</p>} />
        </Routes>
      </Layout>
      
    </BrowserRouter>
  );
}
