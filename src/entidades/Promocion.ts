import {DateTime} from 'luxon';
import type TipoPromocion from './TipoPromocion';
import type Sucursal from './Sucursal';
import type Imagen from './Imagen';
import type PromocionDetalle from './PromocionDetalle';
import ArticuloManufacturado from './ArticuloManufacturado';


export default class Promocion {
    id?: number;
    denominacion: string = "";
    fecha_desde: Date = new Date();
    fecha_hasta: Date = new Date();
    hora_desde: DateTime = DateTime.now();
    hora_hasta: DateTime = DateTime.now();
    descripcion_descuento: string = "";
    precio_promocional: number = 0;
    tipo_promocion?: TipoPromocion;
    detalles?: PromocionDetalle[]=[];
    porc_descuento: Number = 0; 

    
    sucursales: Sucursal[]=[];


    imagen?: Imagen;

    toJSON() {
    return {
      id: this.id,
      denominacion: this.denominacion,
      fecha_desde: this.fecha_desde.toISOString().slice(0,10),            // "YYYY-MM-DD"
      fecha_hasta: this.fecha_hasta.toISOString().slice(0,10),
      hora_desde: this.hora_desde.toFormat('HH:mm:ss'),                   // sólo hora
      hora_hasta: this.hora_hasta.toFormat('HH:mm:ss'),
      descripcion_descuento: this.descripcion_descuento,
      precio_promocional: this.precio_promocional,
      porc_descuento: this.porc_descuento,
      tipo_promocion: this.tipo_promocion ? { id: this.tipo_promocion.id } : undefined,
      sucursales: this.sucursales.map(s => ({ id: s.id })),
      imagen: this.imagen ? { src: this.imagen.src, alt: this.imagen.alt } : undefined,
      detalles: this.detalles?.map(d => ({
      // si el detalle ya tenía id, lo incluyes;  
      ...(d.id != null ? { id: d.id } : {}),
      cantidad: d.cantidad,
      articulo: d.articulo ? { id: d.articulo.id , _type: d.articulo instanceof ArticuloManufacturado ? 'manufacturado' : 'insumo'} : undefined
    }))
    }
  }
}