import type PedidoDetalle from "./PedidoDetalle";

export default class ArticuloManufacturado{
    id: number =0;
    descripcion: string = "";
    tiempo_estimado_minutos: string ="";
    preparacion:string = "";
    
    detalles: PedidoDetalle[] = [];
}