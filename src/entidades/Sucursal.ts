import type Categoria from "./Categoria";
import type Domicilio from "./Domicilio";
import type Empresa from "./Empresa";
import type Pedido from "./Pedido";
import type Promocion from "./Promocion";
import type StockInsumoSucursales from "./StockInsumoSucursales";
import type Usuario from "./Usuario";

export default class Sucursal{
    id?: number;
    nombre: string = "";
    horario_apertura: Date = new Date();
    horario_cierre: Date = new Date();

    domicilio?: Domicilio;
    empresa?: Empresa;
    pedidos: Pedido[]=[];
    categorias: Categoria[]=[];
    promociones: Promocion[]=[];
    stock_insumo_sucursales: StockInsumoSucursales[]=[];
    usuario: Usuario[]=[];
}