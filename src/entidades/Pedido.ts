import { DateTime } from "luxon";
import ArticuloManufacturado from "./ArticuloManufacturado";
import type Domicilio from "./Domicilio";
import type { Estado } from "./Estado";
import type { FormaPago } from "./FormaPago";
import type PedidoDetalle from "./PedidoDetalle";
import type Sucursal from "./Sucursal";
import type { TipoEnvio } from "./TipoEnvio";
import type Usuario from "./Usuario";
import type Factura from "./Factura";


export default class Pedido{
    id?: number ;
    hora_estimada_finalizacion: DateTime = DateTime.now();
    total: number =0;
    estado_pedido?: Estado;
    tipo_envio?: TipoEnvio;
    repartidor?:Usuario;
    detalles: PedidoDetalle[]=[];
    forma_pago?: FormaPago;
    descuento?: number ;
    fecha_pedido : DateTime =  DateTime.now();
    domicilio?: Domicilio;
    sucursal?: Sucursal;
    usuario?: Usuario;
    factura?: Factura;
    

    /**  
   * Este método será llamado automáticamente por JSON.stringify(obj)
   * y nos permite transformar campos DateTime en strings adecuados.
   */
  toJSON() {
    return {
      // Sólo incluyo las props que quiere tu back
      id: this.id,
      hora_estimada_finalizacion: this.hora_estimada_finalizacion.toFormat('HH:mm:ss'),
      total: this.total,
      estado_pedido: this.estado_pedido,
      tipo_envio: this.tipo_envio,
      forma_pago: this.forma_pago,
      descuento: this.descuento,
      fecha_pedido: this.fecha_pedido.toISODate(),        // "YYYY-MM-DD"
      repartidor: this.repartidor ? {id: this.repartidor.id} : undefined,
      domicilio: this.domicilio ? { id: this.domicilio.id } : undefined,
      sucursal: this.sucursal ? { id: this.sucursal.id } : undefined,
      usuario: this.usuario ? { id: this.usuario.id } : undefined,
      factura: this.factura ? { id: this.factura.id } : undefined,
      detalles: this.detalles.map(d => ({
        cantidad: d.cantidad,
        subtotal: d.subtotal,
        articulo: {
          _type: d.articulo instanceof ArticuloManufacturado ? 'manufacturado' : 'insumo',
          id: d.articulo!.id,
          denominacion: d.articulo!.denominacion,
          precio_venta: d.articulo!.precio_venta
          }   
      })),
    }
  }
}