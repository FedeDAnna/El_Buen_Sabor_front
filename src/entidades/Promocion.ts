import {DateTime} from 'luxon';
import type TipoPromocion from './TipoPromocion';
import type Sucursal from './Sucursal';
import type Articulo from './Articulo';
import type Imagen from './Imagen';

export default class Promocion {
    id: number =0;
    denominacion: string = "";
    fecha_desde: Date = new Date();
    fecha_hasta: Date = new Date();
    hora_desde: DateTime = new DateTime();
    hora_hasta: DateTime = new DateTime();
    descripcion_descuento: string = "";
    precio_promocional: number = 0;
    tipo_promocion?: TipoPromocion

    sucursales: Sucursal[]=[];
    articulos: Articulo[]=[];
    imagen?: Imagen;

}