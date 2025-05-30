import type ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import type Categoria from "../entidades/Categoria";
import type TipoCategoria from "../entidades/TipoCategoria";

const API_URL = "http://localhost:8080";
const basic   = btoa(`admin:admin123`);

// Carga los tipos disponibles	
export async function fetchTiposCategoria(): Promise<TipoCategoria[]> {
  const res = await fetch(`${API_URL}/tipo_categorias`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} cargando tipos`)
  return res.json()
}

// Guarda categoría con hijos
export async function guardarCategoriaConHijos(
  categoria: Categoria
): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoria),
  })
  if (!res.ok) throw new Error(`Error ${res.status} guardando categorías`)
  return res.json()
}


 export async function getCategoriasManufacturados(): Promise<Categoria[]> {
   const res = await fetch(`${API_URL}/categorias/manufacturados`,
     {
     method: 'GET',
     credentials: 'include',  
     headers: {
       'Authorization': `Basic ${basic}`,
       'Content-Type': 'application/json'
    }
  }
  );
  if (!res.ok) throw new Error("Error al obtener categorias");
  const data = await res.json();

  return data.map((inst: Categoria) => ({
    ...inst,
    id: inst.id
  }));
}

export async function getArticulosManufacturadoPorCategoria(idCategoria: number): Promise<ArticuloManufacturado[]>{
    const res = await fetch(`${API_URL}/articulos-manufacturados/byCategoria/${idCategoria}`,
    {
    method: 'GET',
    credentials: 'include',  
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json'
    }
  }
  );
  if (!res.ok) throw new Error("Error al obtener articulos");
  const data = await res.json();

  return data.map((inst: ArticuloManufacturado) => ({
    ...inst,
    id: inst.id
  }));
}