import type ArticuloInsumo from "../entidades/ArticuloInsumo";
import type ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import type Categoria from "../entidades/Categoria";
import type Pedido from "../entidades/Pedido";
import type TipoCategoria from "../entidades/TipoCategoria";
import type UnidadDeMedida from "../entidades/UnidadDeMedida";

const API_URL = "http://localhost:8080";
const basic   = btoa(`admin:admin123`);

export async function getArticuloManufacturadoById(
  id: number
): Promise<ArticuloManufacturado> {
  const res = await fetch(`${API_URL}/articulos_manufacturados/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} obteniendo el artículo con ID ${id}`);
  }
  return res.json();
}

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
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando categorías`);
  // Sólo parseamos JSON una vez
  const data = await res.json();
  return data;
}

 export async function getCategoriasByTipo(idTipo: number): Promise<Categoria[]> {
   const res = await fetch(`${API_URL}/categorias/manufacturados/${idTipo}`,
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
    
    const res = await fetch(`${API_URL}/articulos_manufacturados/byCategoria/${idCategoria}`,
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



export async function getArticulosManufacturados(): Promise<ArticuloManufacturado[]>{
    
    const res = await fetch(`${API_URL}/articulos_manufacturados`,
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


/**
 * Carga todos los insumos disponibles
 */
export async function fetchInsumos(): Promise<ArticuloInsumo[]> {
  const res = await fetch(`${API_URL}/articulos_insumos`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  });
  if (!res.ok) throw new Error(`Error ${res.status} cargando insumos`);
  return res.json();
}

/**
 * Guarda un ArticuloManufacturado bajo la categoría indicada
 */
export async function saveArticuloManufacturado(articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {

  console.log("Dentro de APIS FUNCIONES")

  const res = await fetch(
    `${API_URL}/articulos_manufacturados`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articulo),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status} guardando producto`);
  return res.json();
}

export async function fetchCategoriaById(idCategoria: number): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${idCategoria}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer la categoria`)
  return res.json()
}

export async function fetchUnidadesDeMedida(): Promise<UnidadDeMedida[]> {
  const res = await fetch(`${API_URL}/unidades_de_medidas`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer la categoria`)
  return res.json()
}

export async function deleteProductosById(idProduc :Number): Promise<boolean> {
  const res = await fetch(`${API_URL}/articulos_manufacturados/${idProduc}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al borrar el producto manufacturado`)
  return res.json()
}


export async function deleteCategoriaById(idCategoria :Number): Promise<boolean> {
  const res = await fetch(`${API_URL}/categorias/${idCategoria}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al borrar la categoria`)
  return res.json()
}

export async function getPedidos(): Promise<Pedido[]>{
    
    const res = await fetch(`${API_URL}/pedidos`,
    {
    method: 'GET',
    credentials: 'include',  
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json'
    }
  }
  );
  if (!res.ok) throw new Error("Error al obtener pedidos");
  const data = await res.json();
  console.log("data apis",data)

  return data.map((inst: Pedido) => ({
    ...inst,
    id: inst.id
  }));
}