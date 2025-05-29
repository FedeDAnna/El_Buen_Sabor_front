import Articulo from "./Articulo";
import type PedidoDetalle from "./PedidoDetalle";

export default class ArticuloManufacturado extends Articulo{
    
    descripcion: string = "";
    tiempo_estimado_en_minutos: string ="";
    preparacion:string = "";
    
    detalles: PedidoDetalle[] = [];

}