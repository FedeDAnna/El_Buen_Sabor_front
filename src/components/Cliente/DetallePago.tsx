// src/components/Pedido/DetallePago.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchDomiciliosUsuario, getSucursalById, getUsuarioById, savePedido } from '../../services/FuncionesApi';
import { DateTime } from 'luxon'
import '../../estilos/DetallePago.css';
import { useCart } from '../CartContext';
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
  

  const handleFinalizar = async () => {

    if (!selectedDomId && tipoEnvio === TipoEnvio.DELIVERY) {
      alert('Elija una dirección de envío')
      return
    }
    // 3.1) Fecha actual
    const ahora = DateTime.local()
    
    // 3.2) Calcular hora estimada: busco el mayor tiempo entre los productos
    const tiempos = cartItems
    .map(ci => ci.producto)
    .filter((p): p is ArticuloManufacturado => 
      'tiempo_estimado_en_minutos' in p
    )
    .map(m => m.tiempo_estimado_en_minutos)

    // Si no hay manufacturados, por defecto 15 minutos
    const maxMin = tiempos.length > 0
      ? Math.max(...tiempos)
      : 15

    // Ahora este plus nunca recibe NaN
    const horaEstimada = ahora.plus({ minutes: maxMin })
        
    // 3.3) Construir detalles de pedido
    const detalles = cartItems.map(ci => {
      const pd = new PedidoDetalle()
      pd.cantidad = ci.cantidad
      pd.subtotal = ci.subtotal
      pd.articulo = ci.producto
      return pd
    })

    // 3.4) Construir la instancia de Pedido
    
    const pedido = new Pedido()

    pedido.tipo_envio =tipoEnvio
    pedido.forma_pago = formaPago
    pedido.hora_estimada_finalizacion = horaEstimada
    pedido.total = total
    pedido.estado_pedido = Estado.PENDIENTE
    pedido.fecha_pedido = DateTime.local()
    pedido.domicilio = domicilios.filter((d)=> d.id === selectedDomId)[0]
    pedido.sucursal = sucursal
    pedido.usuario = usuario
    pedido.factura = undefined
    pedido.detalles = detalles

    try {
      await savePedido(pedido)
      clearCart()
      navigate('/pedido/confirmado')
    } catch (e) {
      console.error(e)
      alert('Error al procesar el pedido')
    }
  };

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
        <button className="btn-confirm" onClick={handleFinalizar}>
          {tipoEnvio==='DELIVERY' ? 'Pagar con MercadoPago' : 'Finalizar Pedido'}
        </button>
      </div>
    </section>
  );
}
