import { useState } from "react";
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
import Alerta from "./components/ControlAcceso/Alerta";
import { AlertaContext } from "./components/ControlAcceso/AlertaContext";
import { Rol } from "./entidades/Rol";

export default function App() {
  const [alerta, setAlerta] = useState<{
    mensaje: string;
    tipo?: "info" | "error" | "success";
    duracion?: number;
  } | null>(null);
  return (
    <BrowserRouter>
      <UserProvider>
        <AlertaContext.Provider value={setAlerta}>
        <CartProvider>
          <Layout>
          {alerta && (
              <Alerta
                mensaje={alerta.mensaje}
                tipo={alerta.tipo}
                duracion={alerta.duracion}
                onClose={() => setAlerta(null)}
              />
            )}
            <Routes>
              <Route path="/" element={<Navigate to="/HomePage" replace />} />
              <Route path="/HomePage" element={<HomePage />} />
              <Route path="/categorias/:categoriaId" element={<ProductosCategoriaCliente />} />
              <Route path="/articulo/:id" element={<ProductoEnDetalleCliente />} />
              <Route path="/nuestrasSucursales" element={<NuestrasSucursales />} />
              <Route path="/promociones/:id" element={<PromocionEnDetalle />} />
              <Route path="/faq" element={<PreguntasFrecuentes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />

          
              <Route path="/carrito" element={           
                  <CarritoPage />
              } />              

              <Route path="/pedido/pago" element={                
                <RutaProtegida>
                  <DetallePago />                
                </RutaProtegida>
                } />

              <Route path="/pedido/confirmado" element={
                <RutaProtegida>
                  <PedidoConfirmado />
                </RutaProtegida>
              } />

              <Route path="/perfil/:usuarioId" element={
                <RutaProtegida>
                  <DatosPersonales />
                </RutaProtegida>
              } />

            <Route path="/perfil/:usuarioId/editar" element={
              <RutaProtegida>
                <EditarDatosPersonales />
              </RutaProtegida>
              } />

            <Route path="/perfil" element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            } />

            <Route path="/domicilios/:usuarioId" element={
              <RutaProtegida>
                <DomiciliosPage />
              </RutaProtegida>
            } />            
  
            <Route path="/historial-pedidos" element={
              <RutaProtegida>
                <HistorialPedidos />
              </RutaProtegida>
            } />            
            
            <Route path="/admin/Ordenes" element={
              <RutaProtegida rol={[Rol.ADMIN, Rol.CAJERO, Rol.DELIVERY,Rol.COCINERO]}>
                <OrdenesPantalla/>
              </RutaProtegida>
            } />

            <Route path="/admin/estadisticas" element={
                <RutaProtegida rol={[Rol.ADMIN]}>                  
                  <AdminPantalla>
                    <Dashboard />
                  </AdminPantalla>
                </RutaProtegida>
            } />

            <Route path="/admin/productos" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <Productos />
                </AdminPantalla>
              </RutaProtegida>
            }
          />

            <Route path="/admin/insumos/:categoriaId" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <InsumosCategoria />
                </AdminPantalla>
              </RutaProtegida>
            } />

            <Route path="/admin/categorias/:idTipo" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <Productos />
                </AdminPantalla>
              </RutaProtegida>
            } />

            <Route path="/admin/productos/:categoriaId" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <ProductosCategoria />
                </AdminPantalla>
              </RutaProtegida>
            } />

            <Route path="/admin/tipoPromociones" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <TipoPromocionesTabla />
                </AdminPantalla>
              </RutaProtegida>
            } />

            <Route path="/admin/sucursales" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <SucursalesTabla/>
                </AdminPantalla>
              </RutaProtegida>
            }/>

            <Route path="/admin/promocion/:tipoPromocionId" element={
              <RutaProtegida rol={[Rol.ADMIN]}>
                <AdminPantalla>
                  <PromocionTabla />
                </AdminPantalla>
              </RutaProtegida>
            } />
            
            <Route
              path="/admin/empleados" element={
                <RutaProtegida rol={[Rol.ADMIN]}>
                  <AdminPantalla>
                    <TablaUsuarios tipo='empleados' />
                  </AdminPantalla>
                </RutaProtegida>
              }
            />

            <Route path="/admin/clientes"
              element={
                <RutaProtegida rol={[Rol.ADMIN]}>
                  <AdminPantalla>
                    <TablaUsuarios tipo='clientes' />
                  </AdminPantalla>
                </RutaProtegida>
              }
            />

              <Route path="*" element={<p>Página no encontrada</p>} />

            </Routes>
          </Layout>
        </CartProvider>
        </AlertaContext.Provider>
      </UserProvider>
    </BrowserRouter>
  );
}
