import { Navigate, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout/Layout';

import HomePage from './components/Cliente/HomePage';
import ProductosCategoriaCliente from './components/Cliente/ProductosCategoriaCliente';
import ProductoEnDetalleCliente from './components/Cliente/ProductoEnDetalleCliente';
import CarritoPage from './components/Cliente/CarritoPage';
import DetallePago from './components/Cliente/DetallePago';
import PedidoConfirmado from './components/Cliente/PedidoConfirmado';
import Login from './components/Cliente/Login';
import Register from './components/Cliente/Register';
import HistorialPedidos from './components/Cliente/HistorialPedidos';

import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';
import InsumosCategoria from './components/Insumos/InsumosCategoria';

import TipoPromocionesTabla from './components/Promociones/TipoPromocionesTabla';
import PromocionTabla from './components/Promociones/PromocionTabla';
import PromocionEnDetalle from './components/Promociones/PromocionEnDetalle';

import NuestrasSucursales from './components/Sucursales/NuestrasSucursales';
import SucursalesTabla from './components/Sucursales/SucursalesTabla';

import OrdenesPantalla from './components/Ordenes/OrdenesPantalla';
import Dashboard from './components/Estadisticas/Dashboard';

import TablaUsuarios from './components/TablaUsuarios';
import PreguntasFrecuentes from './components/PreguntasFrecuentes';
import TerminosCondiciones from './components/TerminosCondiciones';
import QuienesSomos from './components/QuienesSomos';

import CallbackPage from './components/Auth0/CallbackPage';
import AuthenticationGuard from './components/Auth0/AuthenticationGuard';

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Redirección raíz */}
            <Route path="/" element={<Navigate to="/HomePage" replace />} />

            {/* Callback de Auth0 */}
            <Route path="/callback" element={<CallbackPage />} />

            {/* Rutas públicas */}
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />
            <Route path="/articulo/:id" element={<ProductoEnDetalleCliente />} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/promociones/:id" element={<PromocionEnDetalle />} />
            <Route path="/nuestrasSucursales" element={<NuestrasSucursales />} />
            <Route path="/faq" element={<PreguntasFrecuentes />} />
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />

            {/* Login / Registro */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Rutas protegidas (Auth0) */}
            <Route
              path="/pedido/pago"
              element={
                <AuthenticationGuard>
                  <DetallePago />
                </AuthenticationGuard>
              }
            />
            <Route
              path="/pedido/confirmado"
              element={
                <AuthenticationGuard>
                  <PedidoConfirmado />
                </AuthenticationGuard>
              }
            />
            <Route
              path="/historial-pedidos"
              element={
                <AuthenticationGuard>
                  <HistorialPedidos />
                </AuthenticationGuard>
              }
            />
            <Route
              path="/perfil"
              element={
                <AuthenticationGuard>
                  {/* Tu componente Perfil debe manejar edición y domicilios internamente */}
                  <Login /> {/* Reemplaza por tu <Perfil /> */}
                </AuthenticationGuard>
              }
            />

            {/* Administración (Auth0) */}
            <Route
              path="/admin/ordenes"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <OrdenesPantalla />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/estadisticas"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <Dashboard />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <Productos />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/categorias/:idTipo"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <Productos />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/productos/:categoriaId"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <ProductosCategoria />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/insumos/:categoriaId"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <InsumosCategoria />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/tipoPromociones"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <TipoPromocionesTabla />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/promocion/:tipoPromocionId"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <PromocionTabla />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/sucursales"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <SucursalesTabla />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/empleados"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <TablaUsuarios tipo="empleados" />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <AuthenticationGuard>
                  <AdminPantalla>
                    <TablaUsuarios tipo="clientes" />
                  </AdminPantalla>
                </AuthenticationGuard>
              }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<p>Página no encontrada</p>} />
          </Routes>
        </Layout>
      </CartProvider>
    </UserProvider>
  );
}
