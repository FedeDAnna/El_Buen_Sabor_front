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
import { CartProvider } from './components/CartContext'
import InsumosCategoria from './components/Insumos/InsumosCategoria';
import CarritoPage from './components/Cliente/CarritoPage';
import DetallePago from './components/Cliente/DetallePago';
import PedidoConfirmado from './components/Cliente/PedidoConfirmado';
import TipoPromocionesTabla from './components/Promociones/TipoPromocionesTabla';
import PromocionTabla from './components/Promociones/PromocionTabla';
import PromocionEnDetalle from './components/Promociones/PromocionEnDetalle';
import Dashboard from './components/Estadisticas/Dashboard';
import TablaUsuarios from './components/TablaUsuarios';

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
            <Route path="/carrito" element={<CarritoPage />} />
            
            
            <Route
              path="/promociones/:id"
              element={<PromocionEnDetalle />}
            />

            <Route path="/pedido/confirmado" element={<PedidoConfirmado />} />

            <Route path="/pedido/pago" element={<DetallePago />} />


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
