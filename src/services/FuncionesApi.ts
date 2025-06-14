import { DateTime } from "luxon";
import type ArticuloInsumo from "../entidades/ArticuloInsumo";
import type ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import type Categoria from "../entidades/Categoria";
import type Domicilio from "../entidades/Domicilio";
import type Pedido from "../entidades/Pedido";
import type Promocion from "../entidades/Promocion";
import type Sucursal from "../entidades/Sucursal";
import type TipoCategoria from "../entidades/TipoCategoria";
import type TipoPromocion from "../entidades/TipoPromocion";
import type UnidadDeMedida from "../entidades/UnidadDeMedida";
import type Usuario from "../entidades/Usuario";
import type { PedidoHistorialDTO } from "../DTOs/DTO/PedidoHistorialDTO";

const API_URL = "http://localhost:8080";
const basic   = btoa(`admin:admin123`);

// GET
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

export async function fetchDomiciliosUsuario(): Promise<Domicilio[]> {
  const res = await fetch(`${API_URL}/domicilios`, {
    credentials: 'include',
    headers: { Authorization: `Basic ${basic}` }
  });
  if (!res.ok) throw new Error(`Error ${res.status} cargando domicilios`);
  return res.json();
}

export async function getUsuarioById(idUsuario: number): Promise<Usuario> {
  const res = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer el usuario`)
  return res.json()
}

export async function getSucursalById(idSucuarsal: number): Promise<Sucursal> {
  const res = await fetch(`${API_URL}/sucursales/${idSucuarsal}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al traer la sucursal`)
  return res.json()
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

export async function getArticulosInsumoPorCategoria(idCategoria: number): Promise<ArticuloInsumo[]>{
    
    const res = await fetch(`${API_URL}/articulos_insumos/byCategoria/${idCategoria}`,
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
  

  return data.map((inst: ArticuloInsumo) => ({
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

export async function fetchInsumos(): Promise<ArticuloInsumo[]> {
  const res = await fetch(`${API_URL}/articulos_insumos`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  });
  if (!res.ok) throw new Error(`Error ${res.status} cargando insumos`);
  return res.json();
}

export async function findCategoriaParaVentas(): Promise<Categoria[]>{

  const res = await fetch(`${API_URL}/categorias/ventas`,
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
    throw new Error(`Error ${res.status} obteniendo el artículo Manufacturado con ID ${id}`);
  }
  return res.json();
}

export async function getArticuloInsumoById(
  id: number
): Promise<ArticuloInsumo> {
  const res = await fetch(`${API_URL}/articulos_insumos/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} obteniendo el artículo Insumo con ID ${id}`);
  }
  return res.json();
}

export async function getTiposPromociones(): Promise<TipoPromocion[]> {
  const res = await fetch(`${API_URL}/tipo_promociones`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} obteniendo los tipos de promociones`);
  }
  return res.json();
}

export async function getTipoPromocionById(id: number): Promise<TipoPromocion> {
  const res = await fetch(`${API_URL}/tipo_promociones/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} obteniendo el tipo de promocion con ID ${id}`);
  }
  return res.json();
}

export async function getPromocionById(id: number): Promise<Promocion> {
  const res = await fetch(`${API_URL}/promociones/${id}`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  const raw = await res.json()
  return {
    ...raw,
    // transformar cadenas en instancias
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  }
}

export async function getPromocionesPorTipoPromocion(idTipoPromocion: number): Promise<Promocion[]>{
    const res = await fetch(`${API_URL}/promociones/byTipoPromocion/${idTipoPromocion}`,
    {
    method: 'GET',
    credentials: 'include',  
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json'
    }
  }
  );
  const raw: any[] = await res.json()
  return raw.map(p => ({
    ...p,
    fecha_desde: new Date(p.fecha_desde),
    fecha_hasta: new Date(p.fecha_hasta),
    hora_desde: DateTime.fromISO(p.hora_desde),
    hora_hasta: DateTime.fromISO(p.hora_hasta),
  }))
}

export async function fetchTiposCategoria(): Promise<TipoCategoria[]> {
  const res = await fetch(`${API_URL}/tipo_categorias`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} cargando tipos`)
  return res.json()
}

export async function fetchHistorialPedidosClientes(pagina: number): Promise<PedidoHistorialDTO[]> {
  const res = await fetch(`${API_URL}/pedidos/byClientes/1?page=${pagina}&size=16`, {
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  });
  if (!res.ok) throw new Error(`Error ${res.status} cargando historial`);
  return res.json();
}

// POST

export async function postTipoPromocion(tipoPromocion: TipoPromocion): Promise<TipoPromocion> {
const res = await fetch(`${API_URL}/tipo_promociones`,{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoPromocion),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status} guardando el tipo promocion`);
  return res.json();
}

export async function savePedido(pedido: Pedido): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando pedido`);
  return res.json();
}

export async function savePedidoMP(pedido: Pedido): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/pagos/preference`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando pedido`);
  return res.json();
}

export async function saveArticuloManufacturado(articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {

  const payload = {
    _type: 'manufacturado' as const,
    ...articulo
  }

  const res = await fetch(
    `${API_URL}/articulos_manufacturados`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status} guardando producto`);
  return res.json();
}

export async function saveArticuloInsumo(articulo: ArticuloInsumo): Promise<ArticuloInsumo> {

  const payload = {
    _type: 'insumo' as const,
    ...articulo
  }

  const res = await fetch(
    `${API_URL}/articulos_insumos`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status} guardando el insumo`);
  return res.json();
}

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

export async function postPromocion(promo: Promocion): Promise<Promocion> {
  const res = await fetch(`${API_URL}/promociones`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(promo)
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando la promocion`);
  
  const raw = await res.json()
  return {
    ...raw,
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  }
}


//DELETE

export async function deleteProductosById(idProduc :Number): Promise<boolean> {
  const res = await fetch(`${API_URL}/articulos_manufacturados/${idProduc}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al borrar el producto manufacturado`)
  return res.json()
}

export async function deleteTipoPromocionById(idTipoProm :Number): Promise<boolean> {
  const res = await fetch(`${API_URL}/tipo_promociones/${idTipoProm}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al borrar el tipos de promocion`)
  return res.json()
}

export async function deletePromocionById(idProm :Number): Promise<boolean> {
  const res = await fetch(`${API_URL}/promociones/${idProm}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Authorization': `Basic ${basic}` }
  })
  if (!res.ok)throw new Error(`Error ${res.status} al borrar la promocion`)
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





