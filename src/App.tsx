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
import OrdenesPantalla from './components/Ordenes/OrdenesPantalla';
import { CartProvider } from './components/CartContext'
import InsumosCategoria from './components/Insumos/InsumosCategoria';
import CarritoPage from './components/Cliente/CarritoPage';
import DetallePago from './components/Cliente/DetallePago';
import PedidoConfirmado from './components/Cliente/PedidoConfirmado';
import TipoPromocionesTabla from './components/Promociones/TipoPromocionesTabla';
import PromocionTabla from './components/Promociones/PromocionTabla';
import PromocionEnDetalle from './components/Promociones/PromocionEnDetalle';
import Dashboard from './components/Estadisticas/Dashboard';
import HistorialPedidos from './components/Cliente/HistorialPedidos';
import TablaUsuarios from './components/TablaUsuarios';
import PreguntasFrecuentes from './components/PreguntasFrecuentes';
import TerminosCondiciones from './components/TerminosCondiciones';
import DomiciliosPage from './components/Perfil/DomiciliosPage';
import DatosPersonales from './components/Cliente/DatosPersonales';
import EditarDatosPersonales from './components/Cliente/EditarDatosPersonales';
import SucursalesTabla from './components/Sucursales/SucursalesTabla';
import NuestrasSucursales from './components/Sucursales/NuestrasSucursales';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        
        <Layout>
        <Routes>
          
            <Route path="/" element={<Navigate to="/HomePage" replace />} />

            <Route path="/HomePage" element={<HomePage />} />

            <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />

        <Route path="/articulo/:id" element={<ProductoEnDetalleCliente/>} />
        <Route path="/Ordenes" element={<OrdenesPantalla/>} />
        
          <Route
            path="/admin/productos"
            element={
              <AdminPantalla>
                <Productos />
              </AdminPantalla>
            }
          />
            <Route path="/articulo/:id" element={<ProductoEnDetalleCliente/>} />
            <Route path="/carrito" element={<CarritoPage />} />
            
            <Route path="/perfil/:usuarioId" element={<DatosPersonales />} />
            <Route path="/perfil/:usuarioId/editar" element={<EditarDatosPersonales />} />

            <Route
              path="/promociones/:id"
              element={<PromocionEnDetalle />}
            />

            <Route path="/pedido/confirmado" element={<PedidoConfirmado />} />

            <Route path="/pedido/pago" element={<DetallePago />} />

            <Route path="/domicilios/:usuarioId" element={<DomiciliosPage />} />

            <Route path="/nuestrasSucursales" element={<NuestrasSucursales />} />
  
            <Route path="/historial-pedidos" element={<HistorialPedidos />} />


            <Route
              path="/admin/estadisticas"
              element={
                <AdminPantalla>
                  <Dashboard />
                </AdminPantalla>
              }
            />

            <Route
              path="/admin/insumos/:categoriaId"
              element={
                <AdminPantalla>
                  <InsumosCategoria />
                </AdminPantalla>
              }
            />
            
            
            <Route
              path="/admin/categorias/:idTipo"
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

            <Route path="/admin/tipoPromociones" element={
              <AdminPantalla>
                <TipoPromocionesTabla/>
              </AdminPantalla>
            }/>

            <Route path="/admin/sucursales" element={
              <AdminPantalla>
                <SucursalesTabla/>
              </AdminPantalla>
            }/>

            <Route path="/admin/promocion/:tipoPromocionId" element={
              <AdminPantalla>
                <PromocionTabla/>
              </AdminPantalla>
            }/>

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
    </BrowserRouter>
  );
}
