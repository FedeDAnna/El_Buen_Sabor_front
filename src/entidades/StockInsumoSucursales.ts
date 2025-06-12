import type ArticuloInsumo from "./ArticuloInsumo";
import type Sucursal from "./Sucursal";

export default class StockInsumoSucursales {
    id?: number;
    precioCompra: number =0;
    sotckActual: number = 0;
    stockMaximo: number = 0;
    stockMinimo: number = 0;

    sucursal?: Sucursal;
    articulo_insumo?: ArticuloInsumo;
}