import type ArticuloInsumo from "./ArticuloInsumo";
import type ArticuloManufacturado from "./ArticuloManufacturado";

export default class ArticuloManufacturadoDetalle {
    id: number =0;
    cantidad: number = 0;

    articulo_manufacturado ?: ArticuloManufacturado ;
    articulo_insumo ?: ArticuloInsumo;
}
