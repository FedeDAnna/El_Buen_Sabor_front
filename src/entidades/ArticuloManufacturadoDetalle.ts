import type ArticuloInsumo from "./ArticuloInsumo";
import type ArticuloManufacturado from "./ArticuloManufacturado";

export default class ArticuloManufacturadoDetalle {
    id?: number;
    cantidad: number = 0;

    articulo_manufacturado ?: ArticuloManufacturado ;
    articulo_insumo ?: ArticuloInsumo;
}
