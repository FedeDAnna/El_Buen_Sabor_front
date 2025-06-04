// src/App.tsx
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPantalla from '../src/components/AdminPantalla'
import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';
<<<<<<< HEAD
import HomePage from './components/Cliente/HomePage';
import ProductosCategoriaCliente from './components/Cliente/ProductosCategoriaCliente';
import ProductoEnDetalleCliente from './components/Cliente/ProductoEnDetalleCliente';
=======
import Layout from './components/Layout/Layout';
>>>>>>> origin/ailen

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
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
=======
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/productos" replace />} />

          <Route
            path="/admin/productos"
            element={
              <AdminPantalla>
                <Productos />
              </AdminPantalla>
            }
          />
>>>>>>> origin/ailen

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
