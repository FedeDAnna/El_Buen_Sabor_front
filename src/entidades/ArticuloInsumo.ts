import type StockInsumoSucursales from "./StockInsumoSucursales";

export default class ArticuloInsumo {
    id: number =0;
    es_para_elaborar: boolean = false; //En el back está con snake_case

    stock_insumo_sucursales: StockInsumoSucursales[] = [];

}