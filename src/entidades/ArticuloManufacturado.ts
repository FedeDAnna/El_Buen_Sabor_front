import Articulo from "./Articulo";
import type ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";


export default class ArticuloManufacturado extends Articulo{
    
    descripcion: string = "";
    tiempo_estimado_en_minutos: number =0;
    preparacion:string = "";
    
    detalles: ArticuloManufacturadoDetalle[] = [];

    
}