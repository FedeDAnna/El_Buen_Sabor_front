import Articulo from "./Articulo";
import type StockInsumoSucursales from "./StockInsumoSucursales";

export default class ArticuloInsumo extends Articulo {
    
    es_para_elaborar: boolean = false; //En el back está con snake_case

    stock_insumo_sucursales: StockInsumoSucursales[] = [];

}