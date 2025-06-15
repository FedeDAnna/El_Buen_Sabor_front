// src/components/Pedido/DetallePago.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { fetchDomiciliosUsuario, getArticuloInsumoById, getArticuloManufacturadoById, getSucursalById, getUsuarioById, savePedido, savePedidoMP, updateStockInsumo } from '../../services/FuncionesApi';
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

function isInsumo(a: Articulo): a is ArticuloInsumo {
  return 'stock_insumo_sucursales' in a;
}

function isManufacturado(a: Articulo): a is ArticuloManufacturado {
  return 'detalles' in a;
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

  // Estado para validación de stock
  const [stockOk, setStockOk] = useState<boolean>(true);
  const [stockLoading, setStockLoading] = useState<boolean>(true);
  const [stockError, setStockError] = useState<string>('');

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
            full.detalles.forEach(det => {
              addInsumo(
                det.articulo_insumo!.id!,
                det.cantidad * ci.cantidad
              );
            });
          }
        } else {
          // promoción: cada artículo interno multiplica cantidad de la promo
          const promo = ci.promocion;
          for (const art of promo.articulos) {
            if ('stock_insumo_sucursales' in art) {
              addInsumo(art.id!, ci.cantidad);
            } else {
              const full = await getArticuloManufacturadoById(art.id!);
              full.detalles.forEach(det => {
                addInsumo(
                  det.articulo_insumo!.id!,
                  det.cantidad * ci.cantidad
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
        // para insumos directos: podríamos tener ya cargado stock
        // pero para simplificar, volvemos a leer el manufacturado de ese insumo
        // usando getArticuloManufacturadoById NO sirve, hay que llamar a un endpoint de insumo.
        // Supongamos que “getArticuloManufacturadoById” también devuelve stock si es insumo.
        const insumer = await getArticuloInsumoById(Number(insumoIdStr));
        const available =
          insumer.stock_insumo_sucursales?.[0]?.stock_actual ?? 0;
        if (available < required) {
          if (!canceled) {
            setStockOk(false);
            setStockError(
              'Lo Sentimos. No hay stock suficiente para al menos 1 artículo del carrito. 💔'
            );
              /*INTENTO 1  
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "error",
                title: "No hay stock suficiente para al menos 1 artículo del carrito. 💔"
              });*/

              //! INTENTO 2
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
        const pd = new PedidoDetalle();
        pd.articulo = ci.producto;
        pd.cantidad = ci.cantidad;
        pd.subtotal = ci.subtotal;
        detalles.push(pd);
        totalLista += ci.subtotal;
      } else {
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
    pedido.total = total;
    pedido.descuento = totalLista - total;
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
  
  
const handleFinalizar = async () => {
  const pedido = generarPedido();
  if (!pedido) return;

  try {
    // 1) Guardar pedido en el backend
    const res =
      formaPago === FormaPago.MERCADO_PAGO
        ? await savePedidoMP(pedido)
        : await savePedido(pedido);

    // 2) Si fue MP, abrimos la ventana
    if (formaPago === FormaPago.MERCADO_PAGO) {
      window.open((res as any).url, '_blank');
    }

    // 3) ¡Pedido creado! Ahora deducimos el stock de cada insumo
    // Repetimos la construcción de `need`:
    const need: Record<number, number> = {};
    function addInsumo(id: number, qty: number) {
      need[id] = (need[id] || 0) + qty;
    }

    // 3.1) Construyo `need` para TODO el carrito, incluyendo artículos sueltos:
    for (const ci of cartItems) {
      if (ci.kind === 'articulo') {
        const art = ci.producto;
        if (isInsumo(art)) {
          // insumo suelto
          addInsumo(art.id!, ci.cantidad);
        } else if (isManufacturado(art)) {
          // manufacturado suelto
          // Si no vienes con `art.detalles`, vuelve a pedirlo:
          const full = await getArticuloManufacturadoById(art.id!);
          full.detalles.forEach(det => {
            addInsumo(
              det.articulo_insumo!.id!,
              det.cantidad * ci.cantidad
            );
          });
        }
      } else {
        // promoción (igual que antes)
        const promo = ci.promocion;
        for (const art of promo.articulos) {
          if (isInsumo(art)) {
            addInsumo(art.id!, ci.cantidad);
          } else if (isManufacturado(art)) {
            const full = await getArticuloManufacturadoById(art.id!);
            full.detalles.forEach(det => {
              addInsumo(
                det.articulo_insumo!.id!,
                det.cantidad * ci.cantidad
              );
            });
          }
        }
      }
    }

    // Ahora sí, recorremos need y parcheamos
    await Promise.all(
  Object.entries(need).map(async ([insumoIdStr, qtyUsed]) => {
    const insumoId = Number(insumoIdStr);
    // Vuelvo a leer el insumo completo para conocer su stock actual
    const insumo = await getArticuloInsumoById(insumoId);
    const stockPrev = insumo.stock_insumo_sucursales?.[0]?.stock_actual ?? 0;
    const nuevoStock = stockPrev - qtyUsed;
    // Llamo a tu endpoint de actualización de stock
    return updateStockInsumo(insumoId,nuevoStock);
  })
);


    // 4) Limpiar carrito y redirigir
    clearCart();
    navigate('/pedido/confirmado');
  } catch (err) {
    console.error(err);
    alert('Error al procesar el pedido');
  }
};

  return (
    <section className="dp-container">
      <h2>Detalle del pago</h2>
      {stockLoading && <p>Validando stock…</p>}
      {!stockOk && !stockLoading && (
        <p className="dp-stock-error">{stockError}</p>
      )}

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
        <button
          className="btn-confirm"
          onClick={handleFinalizar}
          disabled={!stockOk || stockLoading}
        >
          {formaPago === FormaPago.MERCADO_PAGO
            ? 'Pagar con MercadoPago'
            : 'Finalizar Pedido'}
        </button>
      </div>
    </section>
  );
}
