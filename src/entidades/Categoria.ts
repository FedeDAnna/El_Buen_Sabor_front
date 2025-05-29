import type Articulo from "./Articulo";

export default class Categoria{
    id: number =0;
    denominacion: string = "";
    
    categoria_padre?:Categoria;
    categorias_hijas ?: Categoria[] = [];
    articulos ?: Articulo[]=[];
}