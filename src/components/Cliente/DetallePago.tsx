// src/components/Pedido/DetallePago.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { getArticuloInsumoById, getArticuloManufacturadoById, getSucursalById, getUsuarioById, savePedido, savePedidoMP, updateStockInsumo } from '../../services/FuncionesApi';
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
import type Articulo from '../../entidades/Articulo';
import type ArticuloInsumo from '../../entidades/ArticuloInsumo';
import MapaGoogle from './MapaGoogle';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { SiMercadopago } from 'react-icons/si';
import { GiDeliveryDrone } from 'react-icons/gi';
import { BiStoreAlt } from 'react-icons/bi';
import { MdDeliveryDining } from 'react-icons/md';

function isInsumo(a: Articulo): a is ArticuloInsumo {
  return 'stock_insumo_sucursales' in a;
}

function isManufacturado(a: Articulo): a is ArticuloManufacturado {
  return 'detalles' in a;
}

async function obtenerCoordenadas(direccion: string): Promise<{ lat: number, lng: number } | null> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=AIzaSyACTocPOlHyRgbE8MTAxfXAR_0jlYMJnXQ`
  );
  const data = await response.json();
  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  console.error('Geocoding error:', data.status);
  return null;
}


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
  const [coordenadas, setCoordenadas] = useState<{ lat: number, lng: number } | null>(null);

  const formaPago = tipoEnvio === TipoEnvio.DELIVERY ? FormaPago.MERCADO_PAGO : FormaPago.EFECTIVO;
  const [horarioOk, setHorarioOk] = useState<boolean>(true)
  const [horaApertura, setHoraApertura] = useState<string>('');
  const [horaCierre, setHoraCierre]     = useState<string>('');

  // Estado para validación de stock
  const [stockOk, setStockOk] = useState<boolean>(true);
  const [stockLoading, setStockLoading] = useState<boolean>(true);
  const [stockError, setStockError] = useState<string>('');

    
  function CheckearHorario() : void{
    const now = DateTime.local()

    // 1) saca el string "HH:mm:ss" de donde esté
    const aperturaStr = typeof sucursal!.horario_apertura === 'string'
      ? sucursal!.horario_apertura
      : DateTime.fromJSDate(sucursal!.horario_apertura!).toFormat('HH:mm:ss')
    const cierreStr = typeof sucursal!.horario_cierre === 'string'
      ? sucursal!.horario_cierre
      : DateTime.fromJSDate(sucursal!.horario_cierre!).toFormat('HH:mm:ss')

       // guardamos en estado
    setHoraApertura(aperturaStr);
    setHoraCierre(cierreStr);
 
    // 2) parsea horas y minutos
    const [hA, mA]       = aperturaStr.split(':').map(Number)
    const [hC, mC]       = cierreStr.split(':').map(Number)

    // 3) clona `now` con la hora del día correspondiente
    const apertura = now.set({ hour: hA, minute: mA, second: 0, millisecond: 0 })
    const cierre   = now.set({ hour: hC, minute: mC, second: 0, millisecond: 0 })

    const abierto = now >= apertura && now <= cierre
    setHorarioOk(abierto)
  }
  
  const usuarioJSON = localStorage.getItem('usuario');
  // Convertir el string JSON en un objeto JavaScript
  const usuarioLog = JSON.parse(usuarioJSON!);
  // Acceder al id del usuario
  const idUsuario = usuarioLog.id;

  useEffect(() => {
    async function cargarDatos() {
      try {
        const user = await getUsuarioById(idUsuario);
        setUsuario(user);
        setDomicilios(user.domicilios);
        if (user.domicilios.length > 0) setSelectedDomId(user.domicilios[0].id);
      } catch (e) {
        setDirError('Error cargando domicilios');
      } finally {
        setDirLoading(false);
      }
      try {
        const suc = await getSucursalById(1);
        setSucursal(suc);
      } catch (e) {
        console.error(e);
      }
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!sucursal) return

    CheckearHorario();

    if(!horarioOk){
      Swal.fire({
        title: "Local Cerrado!",
        text: `Lo sentimos, usted se encuentra fuera del horario de atencion de la Sucursal. Horario: ${horaApertura}-${horaCierre}`,
        imageUrl: "/imagenes/Cerrado.png",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });
    }

  }, [sucursal])


  useEffect(() => {
    async function actualizarCoordenadas() {
      let domicilio: Domicilio | undefined;
      if (tipoEnvio === TipoEnvio.DELIVERY) {
        domicilio = domicilios.find(d => d.id === selectedDomId);
      } else {
        domicilio = sucursal?.domicilio;
      }
      if (!domicilio) return;
      console.log("Domicilio",domicilio)

      const direccion = `${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad!.nombre}, ${domicilio.localidad!.provincia!.nombre}, ${domicilio.localidad!.provincia!.pais!.nombre}`;
      const coords = await obtenerCoordenadas(direccion);
      if (coords) setCoordenadas(coords);
    }
    actualizarCoordenadas();
  }, [selectedDomId, tipoEnvio, domicilios, sucursal]);

  
  
  function calcularHoraEstimada(cartItems: CartItem[]): DateTime {
  const ahora = DateTime.local()

  // 1) Extraer **todos** los manufacturados (sueltos o en promociones)
  const manufacturados: ArticuloManufacturado[] = []

  for (const ci of cartItems) {
    if (ci.kind === 'articulo') {
      const art = ci.producto
      if (isManufacturado(art)) {
        manufacturados.push(art)
      }
    } else {
      // promo con detalles
      for (const det of ci.promocion.detalles ?? []) {
        const art = det.articulo!
        if (isManufacturado(art)) {
          manufacturados.push(art)
        }
      }
    }
  }

  // 2) Calcular el máximo o 15'
  const maxMin =
      manufacturados.length > 0
        ? Math.max(...manufacturados.map(m => m.tiempo_estimado_en_minutos))
        : 15

    // 3) Devolver ahora + maxMin
    return ahora.plus({ minutes: maxMin })
  }


  useEffect(() => {
    let canceled = false;
    async function checkStock() {
      setStockLoading(true);
      // mapa insumoId -> cantidad requerida
      const need: Record<number, number> = {};

      // helper para insumos sueltos
      function addInsumo(id: number, qty: number) {
        need[id] = (need[id] || 0) + qty;
      }

      // 2.1) recorrer el carrito
      for (const ci of cartItems) {
        if (ci.kind === 'articulo') {
          // artículo suelto
          const art = ci.producto;
          if ('stock_insumo_sucursales' in art) {
            // es insumo
            addInsumo(art.id!, ci.cantidad);
          } else {
            // manufacturado: buscar detalles
            const full = await getArticuloManufacturadoById(art.id!);
            full.detalles!.forEach(det => {
              addInsumo(
                det.articulo_insumo!.id!,
                det.cantidad * ci.cantidad
              );
            });
          }
        } else {
          // promoción: cada artículo interno multiplica cantidad de la promo
          const promo = ci.promocion;
          for (const det of promo.detalles || []) {
          const art = det.articulo!;
          // la cantidad total requerida de este artículo de la promo
          const totalQty = det.cantidad * ci.cantidad;
          if ('stock_insumo_sucursales' in art) {
            // es insumo
            addInsumo(art.id!, totalQty);
          } else {
            // manufacturado: desglosamos sus insumos
            const full = await getArticuloManufacturadoById(art.id!);
            full.detalles!.forEach(d2 => {
              addInsumo(
                d2.articulo_insumo!.id!,
                d2.cantidad * totalQty
              );
            });
          }
        }
        }
      }

      // 2.2) comparar con stock real
      for (const insumoIdStr in need) {
        if (canceled) return;
        const required = need[Number(insumoIdStr)];
        const insumer = await getArticuloInsumoById(Number(insumoIdStr));
        const available =
          insumer.stock_insumo_sucursales?.[0]?.stock_actual ?? 0;
        if (available < required) {
          if (!canceled) {
            setStockOk(false);
            setStockError(
              'Lo Sentimos. No hay stock suficiente para al menos 1 artículo del carrito. 💔'
            );
              Swal.fire({
                title: "Sorry!",
                text: "No hay stock suficiente para al menos 1 artículo del carrito. 💔",
                imageUrl: "/imagenes/NoHayStock.png",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "Custom image"
              });

          }
          setStockLoading(false);
          return;
        }
      }

      if (!canceled) {
        setStockOk(true);
        setStockError('');
      }
      setStockLoading(false);
    }

    checkStock();
    return () => { canceled = true; };
  }, [cartItems]);



  function generarPedido(): Pedido | undefined {
  if (!selectedDomId && tipoEnvio === TipoEnvio.DELIVERY) {
    alert('Elija una dirección de envío');
    return undefined;
  }
  if (!stockOk) {
    alert(stockError);
    return;
  }
  const horaEstimada = calcularHoraEstimada(cartItems);
  const detalles: PedidoDetalle[] = [];
  let totalLista = 0;
  let totalPromo = 0;

  cartItems.forEach(ci => {
    if (ci.kind === 'articulo') {
      // Igual que antes para artículos sueltos
      const pd = new PedidoDetalle();
      pd.articulo = ci.producto;
      pd.cantidad = ci.cantidad;
      pd.subtotal = ci.subtotal;
      detalles.push(pd);
      totalLista += ci.subtotal;
    } else {
      // Ahora promo.detalles en lugar de promo.articulos
      const promo = ci.promocion;
      // suma total de la promo
      totalPromo += promo.precio_promocional * ci.cantidad;
      promo.detalles?.forEach(det => {
        const art = det.articulo!;
        // cantidad de este artículo en la promoción multiplicada por cuántas promos
        const qty = det.cantidad * ci.cantidad;
        const pd = new PedidoDetalle();
        pd.articulo = art;
        pd.cantidad = qty;
        pd.subtotal = art.precio_venta * qty;
        detalles.push(pd);
        totalLista += art.precio_venta * qty;
      });
    }
  });

  // Armamos el pedido igual que antes
  const pedido = new Pedido();
  pedido.tipo_envio = tipoEnvio;
  pedido.forma_pago = formaPago;
  pedido.hora_estimada_finalizacion = horaEstimada;
  pedido.total = total;
  pedido.descuento = totalLista - total;
  pedido.estado_pedido = Estado.PENDIENTE;
  pedido.fecha_pedido = DateTime.local();
  pedido.domicilio = domicilios.find(d => d.id === selectedDomId)!;
  pedido.sucursal = sucursal!;
  pedido.usuario = usuario!;
  pedido.repartidor = undefined;
  pedido.detalles = detalles;
  return pedido;
}
 

  
const handleFinalizar = async () => {
  const now = DateTime.local();

  // 1) Chequear horario de la sucursal
  const aperturaStr =
    typeof sucursal!.horario_apertura === 'string'
      ? sucursal!.horario_apertura
      : DateTime.fromJSDate(sucursal!.horario_apertura!).toFormat('HH:mm:ss');
  const cierreStr =
    typeof sucursal!.horario_cierre === 'string'
      ? sucursal!.horario_cierre
      : DateTime.fromJSDate(sucursal!.horario_cierre!).toFormat('HH:mm:ss');

  const [hA, mA] = aperturaStr.split(':').map(Number);
  const [hC, mC] = cierreStr.split(':').map(Number);
  const apertura = now.set({ hour: hA, minute: mA, second: 0, millisecond: 0 });
  const cierre = now.set({ hour: hC, minute: mC, second: 0, millisecond: 0 });

  if (now < apertura || now > cierre) {
    return Swal.fire({
      title: "Local Cerrado!",
      text: `Lo sentimos, estamos fuera del horario de atención (${aperturaStr}–${cierreStr}).`,
      icon: "warning",
      imageUrl: "/imagenes/Cerrado.png",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Sucursal cerrada"
    });
  }
  
  // 2) Generar el objeto Pedido
  const pedido = generarPedido();
  if (!pedido) return;
  


  try {
    const localidadesPermitidas = ['GODOY CRUZ', 'CIUDAD', 'MAIPU'];
      const nombreLocalidad = pedido?.domicilio?.localidad?.nombre?.toUpperCase() ?? '';
      if (!localidadesPermitidas.includes(nombreLocalidad)) {
        return Swal.fire({
          title: "Domicilio fuera del rango!",
          text: `Lo sentimos, estas fuera del rango de entrega de nuestra sucursal.`,
          icon: "warning"
        });
      }

    // 3) Guardar Pedido (o abrir MP)
    const res =
      formaPago === FormaPago.MERCADO_PAGO
        ? await savePedidoMP(pedido)
        : await savePedido(pedido);
    if (formaPago === FormaPago.MERCADO_PAGO) {
      window.open((res as any).url, '_blank');
    }

    // 4) Calcular necesidad de insumos
    const need: Record<number, number> = {};
    const addInsumo = (id: number, qty: number) => {
      need[id] = (need[id] || 0) + qty;
    };

    // 4.1) Recorrer carrito
    for (const ci of cartItems) {
      if (ci.kind === 'articulo') {
        const art = ci.producto;
        if (isInsumo(art)) {
          addInsumo(art.id!, ci.cantidad);
        } else {
          const full = await getArticuloManufacturadoById(art.id!);
          for (const det of full.detalles!) {
            addInsumo(det.articulo_insumo!.id!, det.cantidad * ci.cantidad);
          }
        }
      } else {
        // PROMOCIÓN: recorremos promo.detalles con for…of
        const promo = ci.promocion;
        for (const det of promo.detalles ?? []) {
          const art = det.articulo!;
          const qtyPromo = det.cantidad * ci.cantidad;
          if (isInsumo(art)) {
            addInsumo(art.id!, qtyPromo);
          } else {
            const full = await getArticuloManufacturadoById(art.id!);
            for (const innerDet of full.detalles!) {
              addInsumo(
                innerDet.articulo_insumo!.id!,
                innerDet.cantidad * qtyPromo
              );
            }
          }
        }
      }
    }

    // 4.2) Actualizar stock en paralelo
    await Promise.all(
      Object.entries(need).map(async ([insumoIdStr, qtyUsed]) => {
        const insumoId = Number(insumoIdStr);
        const insumo = await getArticuloInsumoById(insumoId);
        const stockPrev = insumo.stock_insumo_sucursales?.[0]?.stock_actual ?? 0;
        return updateStockInsumo(insumoId, stockPrev - qtyUsed);
      })
    );

    // 5) Limpiar y redirigir
    clearCart();
    navigate('/pedido/confirmado');
  } catch (err) {
    console.error(err);
    alert('Error al procesar el pedido');
  }
};


  return (
    <section className="dp-container-final">
      <h2>Detalle del pago</h2>
      {stockLoading && <p>Validando stock…</p>}
      {!stockOk && !stockLoading && (
        <p className="dp-stock-error">{stockError}</p>
      )}

      {!horarioOk && (
        <div className="error">
          Lo sentimos, estamos fuera de horario. No puedes pasar tu pedido ahora.  
          <br/>
          <strong>Horario de Atención:</strong> {horaApertura} – {horaCierre}
        </div>
      )}

      
      <div className="dp-section">
        <label>Indique</label>
        <div className="dp-buttons">
            <button
                className={tipoEnvio === TipoEnvio.DELIVERY ? 'active' : ''}
                onClick={() => setTipoEnvio(TipoEnvio.DELIVERY)}
            ><MdDeliveryDining style={{ marginRight: '8px', fontSize: '24px' ,verticalAlign: 'middle'}}/>
              Delivery
            </button>
          <button
            className={tipoEnvio === TipoEnvio.TAKE_AWAY ? 'active' : ''}
            onClick={() => setTipoEnvio(TipoEnvio.TAKE_AWAY)}
            ><BiStoreAlt style={{ marginRight: '8px', fontSize: '24px' ,verticalAlign: 'middle'}}/>
              Retiro en Local
            </button>
        </div>
      </div>
      

      <div className="dp-section">
        <label>
          
          {tipoEnvio === TipoEnvio.DELIVERY ? 'Dirección de envío' : 'Dirección del restaurante'}
        </label>
        
        
        {tipoEnvio === TipoEnvio.DELIVERY ? (
          dirLoading ? <p>Cargando direcciones…</p> :
          dirError  ? <p className="error">{dirError}</p> :
          <select  className='dp-select'
            value={selectedDomId}
            onChange={e => setSelectedDomId(Number(e.target.value))}
          >
            {domicilios.map(d => (
              <option key={d.id} value={d.id}>
                {d.calle} {d.numero}, CP {d.cp}
              </option>
            ))}
          </select>
        ) : null}

        {tipoEnvio === TipoEnvio.DELIVERY ? (
          <Link to={`/domicilios/${usuario?.id}`} className="pc-btn">
            Ir a Mis direcciones
          </Link>
        ) : <p>{sucursal?.domicilio?.calle} {sucursal?.domicilio?.numero} {sucursal?.domicilio?.localidad?.nombre}</p>}

        
        <div className="dp-map">
          {coordenadas ? (
            <MapaGoogle lat={coordenadas.lat} lng={coordenadas.lng} />
          ) : (
            <p>Cargando mapa…</p>
          )}
        </div>
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
        {formaPago === FormaPago.MERCADO_PAGO ?
          <button
            className="mercadopago-button"
            onClick={handleFinalizar}
            disabled={!stockOk || stockLoading || !horarioOk}
          ><SiMercadopago style={{ marginRight: '8px', fontSize: '24px' ,verticalAlign: 'middle'}} />

           Mercado Pago
          </button>
        : <button
            className="btn-confirm"
            onClick={handleFinalizar}
            disabled={!stockOk || stockLoading || !horarioOk}
          ><CheckCircle style={{ marginRight: '8px' }} />
            Finalizar Pedido
          </button>}
        <button className="btn-cancel" onClick={()=>navigate(-1)}>
          Cancelar
        </button>
        
      </div>
    </section>
  );
}
