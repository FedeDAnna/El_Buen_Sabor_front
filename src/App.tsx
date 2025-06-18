// src/App.tsx
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPantalla from '../src/components/AdminPantalla';
import Productos from './components/Productos/Productos';
import ProductosCategoria from './components/Productos/ProductosCategoria';
import Layout from './components/Layout/Layout';
import HomePage from './components/Cliente/HomePage';
import ProductosCategoriaCliente from './components/Cliente/ProductosCategoriaCliente';
import ProductoEnDetalleCliente from './components/Cliente/ProductoEnDetalleCliente';
import OrdenesPantalla from './components/Ordenes/OrdenesPantalla';
import { CartProvider } from './components/CartContext';
import InsumosCategoria from './components/Insumos/InsumosCategoria';
import CarritoPage from './components/Cliente/CarritoPage';
import DetallePago from './components/Cliente/DetallePago';
import PedidoConfirmado from './components/Cliente/PedidoConfirmado';
import TipoPromocionesTabla from './components/Promociones/TipoPromocionesTabla';
import PromocionTabla from './components/Promociones/PromocionTabla';
import PromocionEnDetalle from './components/Promociones/PromocionEnDetalle';
import DomiciliosPage from './components/Perfil/DomiciliosPage';
import DatosPersonales from './components/Cliente/DatosPersonales';
import EditarDatosPersonales from './components/Cliente/EditarDatosPersonales';
import SucursalesTabla from './components/Sucursales/SucursalesTabla';
import NuestrasSucursales from './components/Sucursales/NuestrasSucursales';
import Dashboard from './components/Estadisticas/Dashboard';
import HistorialPedidos from './components/Cliente/HistorialPedidos';
import TablaUsuarios from './components/TablaUsuarios';
import PreguntasFrecuentes from './components/PreguntasFrecuentes';
import TerminosCondiciones from './components/TerminosCondiciones';
import Login from './components/Cliente/Login';
import Register from './components/Cliente/Register';
import RutaProtegida from "./components/RutaProtegida";
import { UserProvider } from "./contexts/UserContext";
import Perfil from './components/Perfil';


export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/HomePage" replace />} />
              <Route path="/HomePage" element={<HomePage />} />
              <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />
              <Route path="/articulo/:id" element={<ProductoEnDetalleCliente />} />
        
          
              <Route path="/carrito" element={
                
                  <CarritoPage />
                
              } />

              <Route path="/promociones/:id" element={<PromocionEnDetalle />} />
              
              <Route path="/pedido/confirmado" element={<PedidoConfirmado />} />

              <Route path="/pedido/pago" element={<DetallePago />} />

              
            <Route path="/perfil/:usuarioId/editar" element={<EditarDatosPersonales />} />

            <Route path="/perfil" element={
              <RutaProtegida>  {/* Solo requiere estar logueado */}
                <DatosPersonales />
              </RutaProtegida>
            } />

            <Route path="/domicilios/:usuarioId" element={<DomiciliosPage />} />

            <Route path="/nuestrasSucursales" element={<NuestrasSucursales />} />
  
            <Route path="/historial-pedidos" element={<HistorialPedidos />} />

            <Route path="/faq" element={<PreguntasFrecuentes />} />

            <Route path="/terminos" element={<TerminosCondiciones />} />  
            
            <Route path="/admin/Ordenes" element={<OrdenesPantalla/>} />
            <Route
              path="/admin/estadisticas"
              element={
                <AdminPantalla>
                  <Dashboard />
                </AdminPantalla>
              }
            />
            <Route path="/domicilios/:usuarioId" element={<DomiciliosPage />} />

            <Route path="/nuestrasSucursales" element={<NuestrasSucursales />} />
            
                        <Route
            path="/admin/productos"
            element={
              <AdminPantalla>
                <Productos />
              </AdminPantalla>
            }
          />
              {/* 🔐 ADMIN */}
              <Route path="/admin/insumos/:categoriaId" element={
                <RutaProtegida rol="ADMIN">
                  <AdminPantalla>
                    <InsumosCategoria />
                  </AdminPantalla>
                </RutaProtegida>
              } />

              <Route path="/admin/categorias/:idTipo" element={
                <RutaProtegida rol="ADMIN">
                  <AdminPantalla>
                    <Productos />
                  </AdminPantalla>
                </RutaProtegida>
              } />

              <Route path="/admin/productos/:categoriaId" element={
                <RutaProtegida rol="ADMIN">
                  <AdminPantalla>
                    <ProductosCategoria />
                  </AdminPantalla>
                </RutaProtegida>
              } />

              <Route path="/admin/tipoPromociones" element={
                <RutaProtegida rol="ADMIN">
                  <AdminPantalla>
                    <TipoPromocionesTabla />
                  </AdminPantalla>
                </RutaProtegida>
              } />

            <Route path="/admin/sucursales" element={
              <AdminPantalla>
                <SucursalesTabla/>
              </AdminPantalla>
            }/>

              <Route path="/admin/promocion/:tipoPromocionId" element={
                <RutaProtegida rol="ADMIN">
                  <AdminPantalla>
                    <PromocionTabla />
                  </AdminPantalla>
                </RutaProtegida>
              } />

              {/* Login / Registro */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
            <Route
              path="/admin/empleados"
              element={
                <AdminPantalla>
                  <TablaUsuarios tipo='empleados' />
                </AdminPantalla>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <AdminPantalla>
                  <TablaUsuarios tipo='clientes' />
                </AdminPantalla>
              }
            />

              <Route path="*" element={<p>Página no encontrada</p>} />
            </Routes>
          </Layout>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
