import type ArticuloInsumo from "./ArticuloInsumo";
import type Sucursal from "./Sucursal";

export default class StockInsumoSucursales {
    id?: number;
    precio_compra: number =0;
    stock_actual: number = 0;
    stock_maximo: number = 0;
    stock_minimo: number = 0;

    sucursal?: Sucursal;
    articulo_insumo?: ArticuloInsumo;
}