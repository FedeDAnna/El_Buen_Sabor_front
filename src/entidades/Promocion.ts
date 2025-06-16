import {DateTime} from 'luxon';
import type TipoPromocion from './TipoPromocion';
import type Sucursal from './Sucursal';
import type Articulo from './Articulo';
import type Imagen from './Imagen';


export default class Promocion {
    id?: number;
    denominacion: string = "";
    hora_desde: DateTime = DateTime.now();
    hora_hasta: DateTime = DateTime.now();
    descripcion_descuento: string = "";
    precio_promocional: number = 0;
    tipo_promocion?: TipoPromocion

    sucursales: Sucursal[]=[];
    articulos: Articulo[]=[];
    imagen?: Imagen;

}