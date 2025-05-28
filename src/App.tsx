// src/App.tsx
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPantalla from '../src/components/AdminPantalla'
import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
