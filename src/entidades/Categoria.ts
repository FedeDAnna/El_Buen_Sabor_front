import type Articulo from "./Articulo";
import type TipoCategoria from "./TipoCategoria";


export default class Categoria{
    id?: number;
    denominacion: string = "";
    
    categorias_hijas?:Categoria[]=[];
    articulos ?: Articulo[]=[];
    tipo_categoria ?: TipoCategoria;
}