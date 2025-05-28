import type Categoria from "./Categoria";
import Imagen from "./Imagen";
import type UnidadDeMedida from "./UnidadDeMedida";

export default class Articulo {
    id: number =0;
    denominacin: string = "";
    precio_venta: number = 0;
    imagen?: Imagen;
    unidad_de_medida?: UnidadDeMedida;
    categoria?:Categoria;
}



