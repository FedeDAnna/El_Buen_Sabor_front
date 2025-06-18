// src/components/Pedido/DetallePago.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchDomiciliosUsuario, getSucursalById, getUsuarioById, savePedido, savePedidoMP } from '../../services/FuncionesApi';
import { DateTime } from 'luxon'
import '../../estilos/DetallePago.css';
import { useCart, type CartItem } from '../CartContext';
import Domicilio from '../../entidades/Domicilio';
import PedidoDetalle from '../../entidades/PedidoDetalle';
import Pedido from '../../entidades/Pedido';
import { TipoEnvio } from '../../entidades/TipoEnvio';
import { FormaPago } from '../../entidades/FormaPago';
import { Estado } from '../../entidades/Estado';
import Usuario from '../../entidades/Usuario';
import Sucursal from '../../entidades/Sucursal';
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado';

export default function DetallePago() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>(TipoEnvio.DELIVERY)
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [dirLoading, setDirLoading] = useState(true);
  const [dirError, setDirError] = useState<string|null>(null);
  const [selectedDomId, setSelectedDomId] = useState<number|undefined>(undefined);
  const [usuario, setUsuario] = useState<Usuario>()
  const [sucursal, setSucursal] = useState<Sucursal>()

  useEffect(() => {
    fetchDomiciliosUsuario()
      .then(list => {
        setDomicilios(list);
        if (list.length) setSelectedDomId(list[0].id);
      })
      .catch(e => setDirError(e.message))
      .finally(() => setDirLoading(false));
    getUsuarioById(1)
      .then(user => setUsuario(user))
      .catch(e => console.error(e))
    getSucursalById(1)
      .then(suc => setSucursal(suc))
      .catch(e => console.error(e))  
  }, []);

  const formaPago = tipoEnvio === TipoEnvio.DELIVERY ? FormaPago.MERCADO_PAGO : FormaPago.EFECTIVO;
  
  function calcularHoraEstimada(cartItems: CartItem[]): DateTime {
    const ahora = DateTime.local();

    // 1) Extraer **todos** los artículos (sueltos o dentro de promociones)
    const todosLosArticulos = cartItems.flatMap(ci => {
      if (ci.kind === 'articulo') {
        return [ci.producto];
      } else {
        // es una promo: devolvemos su lista de artículos
        return ci.promocion.articulos;
      }
    });

    // 2) Filtrar sólo los manufacturados para leerles 'tiempo_estimado_en_minutos'
    const manufacturados = todosLosArticulos.filter(
      (p): p is ArticuloManufacturado =>
        'tiempo_estimado_en_minutos' in p
    );

    // 3) Calcular el máximo de tiempo o 15' por defecto
    const maxMin =
      manufacturados.length > 0
        ? Math.max(
            ...manufacturados.map(m => m.tiempo_estimado_en_minutos)
          )
        : 15;

    // 4) Sumar al now
    return ahora.plus({ minutes: maxMin });
  }


  function generarPedido(): Pedido | undefined {
    if (!selectedDomId && tipoEnvio === TipoEnvio.DELIVERY) {
      alert('Elija una dirección de envío');
      return undefined;
    }
    const horaEstimada = calcularHoraEstimada(cartItems);
    // 2) desglosar items y promociones
    const detalles: PedidoDetalle[] = [];
    let totalLista = 0;
    let totalPromo = 0;

    cartItems.forEach(ci => {
      if (ci.kind === 'articulo') {
        // artículo suelto
        const pd = new PedidoDetalle();
        pd.articulo = ci.producto;
        pd.cantidad = ci.cantidad;
        pd.subtotal = ci.subtotal;
        detalles.push(pd);
        totalLista += ci.subtotal;
      } else {
        // promoción: desmontar sus artículos
        const promo = ci.promocion;
        totalPromo += promo.precio_promocional * ci.cantidad;
        promo.articulos.forEach(a => {
          const pd = new PedidoDetalle();
          pd.articulo = a;
          pd.cantidad = ci.cantidad;
          pd.subtotal = a.precio_venta * ci.cantidad;
          detalles.push(pd);
          totalLista += a.precio_venta * ci.cantidad;
        });
      }
    });

    // 3) armar Pedido
    const pedido = new Pedido();
    pedido.tipo_envio = tipoEnvio;
    pedido.forma_pago = formaPago;
    pedido.hora_estimada_finalizacion = horaEstimada;
    pedido.total = total;                   // lo que paga el cliente
    pedido.descuento = totalLista - total;  // diferencia entre lista y precio final
    pedido.estado_pedido = Estado.PENDIENTE;
    pedido.fecha_pedido = DateTime.local();
    pedido.domicilio = domicilios.find(d => d.id === selectedDomId)!;
    pedido.sucursal = sucursal!;
    pedido.usuario = usuario!;
    pedido.repartidor = undefined;
    pedido.factura = undefined;
    pedido.detalles = detalles;

    return pedido;
  } 
  
  const handlefinalizarEfectivo = async() => {
    const pedido : Pedido|undefined = generarPedido()
    if(pedido != undefined){
    try {
      await savePedido(pedido)
      clearCart()
      navigate('/pedido/confirmado')
    } catch (e) {
      console.error(e)
      alert('Error al procesar el pedido')
    }} else {
      alert("No se recibió ningun pedido")
    }
  }
  
  const handlefinalizarMP = async() => {
    const pedido : Pedido|undefined = generarPedido()
    if(pedido != undefined){
    try {
      const res = await savePedidoMP(pedido)
      console.log(res)
      clearCart()
      window.open(res.url, '_blank');
      navigate('/pedido/confirmado')
    } catch (e) {
      console.error(e)
      alert('Error al procesar el pedido')
    }} else {
      alert("No se recibió ningun pedido")
    }
  }

  return (
    <section className="dp-container">
      <h2>Detalle del pago</h2>

      <div className="dp-section">
        <label>Indique</label>
        <div className="dp-buttons">
            <button
                className={tipoEnvio === TipoEnvio.DELIVERY ? 'active' : ''}
                onClick={() => setTipoEnvio(TipoEnvio.DELIVERY)}
            >Delivery
            </button>
          <button
            className={tipoEnvio === TipoEnvio.TAKE_AWAY ? 'active' : ''}
            onClick={() => setTipoEnvio(TipoEnvio.TAKE_AWAY)}
            >
            Retiro en Local
            </button>
        </div>
      </div>

      <div className="dp-section">
        <label>
          {tipoEnvio==='DELIVERY' ? 'Dirección de envío' : 'Dirección del restaurante'}
        </label>
        {tipoEnvio==='DELIVERY' ? (
          dirLoading ? <p>Cargando direcciones…</p> :
          dirError  ? <p className="error">{dirError}</p> :
          <select
            value={selectedDomId}
            onChange={e => setSelectedDomId(Number(e.target.value))}
          >
            {domicilios.map(d=>(
              <option key={d.id} value={d.id}>
                {d.calle} {d.numero}, CP {d.cp}
              </option>
            ))}
          </select>
        ) : (
          <div className="dp-map placeholder">
            {/* Mapa fijo del local */}
            <img src="/assets/map-local.png" alt="Mapa del local"/>
          </div>
        )}
      </div>

      <div className="dp-section resumen">
        <div>
          <div>Subtotal</div>
          <div>${total.toLocaleString()}</div>
        </div>
        <div>
          <div>Total</div>
          <div className="total">${total.toLocaleString()}</div>
        </div>
      </div>

      <div className="dp-section">
        <label>Método de Pago</label>
        <button className={`dp-pay ${formaPago==='MERCADO_PAGO'?'active':''}`}>
          {formaPago}
        </button>
      </div>

      <div className="dp-actions">
        <button className="btn-cancel" onClick={()=>navigate(-1)}>
          Cancelar
        </button>
        {tipoEnvio==='DELIVERY'  ?(
        <button className="btn-confirm" onClick={handlefinalizarEfectivo}>
          Finalizar Pedido
        </button>)
         :(
         <button className="btn-confirm" onClick={handlefinalizarMP}>
          Pagar con MercadoPago
        </button>)
        } 
        
      </div>
    </section>
  );
}
