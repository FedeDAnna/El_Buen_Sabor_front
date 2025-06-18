import { Navigate, Routes, Route } from 'react-router-dom';
import AdminPantalla from './components/AdminPantalla';
import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';
import Layout from './components/Layout/Layout';
import HomePage from './components/Cliente/HomePage';
import ProductosCategoriaCliente from './components/Cliente/ProductosCategoriaCliente';
import ProductoEnDetalleCliente from './components/Cliente/ProductoEnDetalleCliente';
import CarritoPage from './components/Cliente/CarritoPage';
import DetallePago from './components/Cliente/DetallePago';
import PedidoConfirmado from './components/Cliente/PedidoConfirmado';
import TipoPromocionesTabla from './components/Promociones/TipoPromocionesTabla';
import PromocionTabla from './components/Promociones/PromocionTabla';
import PromocionEnDetalle from './components/Promociones/PromocionEnDetalle';
import Login from './components/Cliente/Login';
import Register from './components/Cliente/Register';
import RutaProtegida from "./components/RutaProtegida";
import { UserProvider } from "./contexts/UserContext";
import Perfil from './components/Perfil';

import Dashboard from './components/Estadisticas/Dashboard';
import HistorialPedidos from './components/Cliente/HistorialPedidos';
import InsumosCategoria from './components/Insumos/InsumosCategoria';
import CallbackPage from './components/Auth0/CallbackPage';
import AuthenticationGuard from './components/Auth0/AuthenticationGuard';
import { CartProvider } from './components/CartContext';

export default function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>

          {/* Redirección root */}
          <Route path="/" element={<Navigate to="/HomePage" replace />} />

          {/* Auth0 callback */}
          <Route path="/callback" element={<CallbackPage />} />

          {/* Rutas públicas */}
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />
          <Route path="/articulo/:id" element={<ProductoEnDetalleCliente />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/promociones/:id" element={<PromocionEnDetalle />} />

          {/* Rutas protegidas */}
          <Route path="/pedido/confirmado" element={
            <AuthenticationGuard><PedidoConfirmado /></AuthenticationGuard>
          } />
          <Route path="/pedido/pago" element={
            <AuthenticationGuard><DetallePago /></AuthenticationGuard>
          } />
          <Route path="/historial-pedidos" element={
            <AuthenticationGuard><HistorialPedidos /></AuthenticationGuard>
          } />

          {/* Rutas de administración protegidas */}
          <Route path="/admin/estadisticas" element={
            <AuthenticationGuard>
              <AdminPantalla><Dashboard /></AdminPantalla>
            </AuthenticationGuard>
          } />
          <Route path="/admin/insumos/:categoriaId" element={
            <AuthenticationGuard>
              <AdminPantalla><InsumosCategoria /></AdminPantalla>
            </AuthenticationGuard>
          } />
          <Route path="/admin/categorias/:idTipo" element={
            <AuthenticationGuard>
              <AdminPantalla><Productos /></AdminPantalla>
            </AuthenticationGuard>
          } />
          <Route path="/admin/productos/:categoriaId" element={
            <AuthenticationGuard>
              <AdminPantalla><ProductosCategoria /></AdminPantalla>
            </AuthenticationGuard>
          } />
          <Route path="/admin/tipoPromociones" element={
            <AuthenticationGuard>
              <AdminPantalla><TipoPromocionesTabla /></AdminPantalla>
            </AuthenticationGuard>
          } />
          <Route path="/admin/promocion/:tipoPromocionId" element={
            <AuthenticationGuard>
              <AdminPantalla><PromocionTabla /></AdminPantalla>
            </AuthenticationGuard>
          } />

          {/* Rutas Mauri Ver */}
          <Route path="/perfil" element={
            <AuthenticationGuard>
                  <Perfil />
            </AuthenticationGuard>
          } />
          {/* Login / Registro */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
          {/* Ruta por defecto */}
          <Route path="*" element={<p>Página no encontrada</p>} />
        </Routes>
      </Layout>
    </CartProvider>
  );
}
