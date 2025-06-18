import { useToken } from "../components/Auth0/AuthTokenContext"; // según tu ruta real

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
import type RegistroDTO from "../entidades/RegistroDTO";


import type { PedidoHistorialDTO } from "../DTOs/DTO/PedidoHistorialDTO";

const API_URL = "http://localhost:8080";

let tokenGetter: () => Promise<string>;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

async function securedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!tokenGetter) throw new Error("Token getter no configurado");
  const token = await tokenGetter();
  return fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function fetchCategoriaById(idCategoria: number): Promise<Categoria> {
  const res = await securedFetch(`/categorias/${idCategoria}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer la categoria`);
  return res.json();
}

export async function fetchUnidadesDeMedida(): Promise<UnidadDeMedida[]> {
  const res = await securedFetch(`/unidades_de_medidas`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer unidades`);
  return res.json();
}

export async function fetchDomiciliosUsuario(): Promise<Domicilio[]> {
  const res = await securedFetch(`/domicilios`);
  if (!res.ok) throw new Error(`Error ${res.status} cargando domicilios`);
  return res.json();
}

export async function getUsuarioById(idUsuario: number): Promise<Usuario> {
  const res = await securedFetch(`/usuarios/${idUsuario}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer el usuario`);
  return res.json();
}

export async function getSucursalById(idSucursal: number): Promise<Sucursal> {
  const res = await securedFetch(`/sucursales/${idSucursal}`);
  if (!res.ok) throw new Error(`Error ${res.status} al traer la sucursal`);
  return res.json();
}

export async function getArticulosManufacturadoPorCategoria(idCategoria: number): Promise<ArticuloManufacturado[]> {
  const res = await securedFetch(`/articulos_manufacturados/byCategoria/${idCategoria}`);
  if (!res.ok) throw new Error("Error al obtener articulos");
  return res.json();
}

export async function getArticulosInsumoPorCategoria(idCategoria: number): Promise<ArticuloInsumo[]> {
  const res = await securedFetch(`/articulos_insumos/byCategoria/${idCategoria}`);
  if (!res.ok) throw new Error("Error al obtener articulos");
  return res.json();
}

export async function getArticulosManufacturados(): Promise<ArticuloManufacturado[]> {
  const res = await securedFetch(`/articulos_manufacturados`);
  if (!res.ok) throw new Error("Error al obtener articulos");
  return res.json();
}

export async function fetchInsumos(): Promise<ArticuloInsumo[]> {
  const res = await securedFetch(`/articulos_insumos`);
  if (!res.ok) throw new Error(`Error ${res.status} cargando insumos`);
  return res.json();
}

export async function findCategoriaParaVentas(): Promise<Categoria[]> {
  const res = await securedFetch(`/categorias/ventas`);
  if (!res.ok) throw new Error("Error al obtener categorias");
  return res.json();
}

export async function getCategoriasByTipo(idTipo: number): Promise<Categoria[]> {
  const res = await securedFetch(`/categorias/manufacturados/${idTipo}`);
  if (!res.ok) throw new Error("Error al obtener categorias");
  return res.json();
}

export async function getArticuloManufacturadoById(id: number): Promise<ArticuloManufacturado> {
  const res = await securedFetch(`/articulos_manufacturados/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo el artículo Manufacturado con ID ${id}`);
  return res.json();
}

export async function getArticuloInsumoById(id: number): Promise<ArticuloInsumo> {
  const res = await securedFetch(`/articulos_insumos/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo el artículo Insumo con ID ${id}`);
  return res.json();
}

export async function getTiposPromociones(): Promise<TipoPromocion[]> {
  const res = await securedFetch(`/tipo_promociones`);
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo los tipos de promociones`);
  return res.json();
}

export async function getTipoPromocionById(id: number): Promise<TipoPromocion> {
  const res = await securedFetch(`/tipo_promociones/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} obteniendo el tipo de promocion con ID ${id}`);
  return res.json();
}

export async function getPromocionById(id: number): Promise<Promocion> {
  const res = await securedFetch(`/promociones/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const raw = await res.json();
  return {
    ...raw,
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  };
}

export async function getPromocionesPorTipoPromocion(idTipoPromocion: number): Promise<Promocion[]> {
  const res = await securedFetch(`/promociones/byTipoPromocion/${idTipoPromocion}`);
  const raw: any[] = await res.json();
  return raw.map(p => ({
    ...p,
    fecha_desde: new Date(p.fecha_desde),
    fecha_hasta: new Date(p.fecha_hasta),
    hora_desde: DateTime.fromISO(p.hora_desde),
    hora_hasta: DateTime.fromISO(p.hora_hasta),
  }));
}

export async function fetchTiposCategoria(): Promise<TipoCategoria[]> {
  const res = await securedFetch(`/tipo_categorias`);
  if (!res.ok) throw new Error(`Error ${res.status} cargando tipos`);
  return res.json();
}

export async function fetchHistorialPedidosClientes(pagina: number): Promise<PedidoHistorialDTO[]> {
  const res = await securedFetch(`/pedidos/byClientes/1?page=${pagina}&size=16`);
  if (!res.ok) throw new Error(`Error ${res.status} cargando historial`);
  return res.json();
}

export async function postTipoPromocion(tipoPromocion: TipoPromocion): Promise<TipoPromocion> {
  const res = await securedFetch(`/tipo_promociones`, {
    method: 'POST',
    body: JSON.stringify(tipoPromocion),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando el tipo promocion`);
  return res.json();
}

export async function savePedido(pedido: Pedido): Promise<Pedido> {
  const res = await securedFetch(`/pedidos`, {
    method: 'POST',
    body: JSON.stringify(pedido),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando pedido`);
  return res.json();
}

export async function savePedidoMP(pedido: Pedido): Promise<{ url: string }> {
  const res = await securedFetch(`/pagos/preference`, {
    method: 'POST',
    body: JSON.stringify(pedido),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando pedido`);
  return res.json();
}

export async function saveArticuloManufacturado(articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {
  const payload = { _type: 'manufacturado' as const, ...articulo };
  const res = await securedFetch(`/articulos_manufacturados`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando producto`);
  return res.json();
}

export async function saveArticuloInsumo(articulo: ArticuloInsumo): Promise<ArticuloInsumo> {
  const payload = { _type: 'insumo' as const, ...articulo };
  const res = await securedFetch(`/articulos_insumos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando el insumo`);
  return res.json();
}

export async function guardarCategoriaConHijos(categoria: Categoria): Promise<Categoria> {
  const res = await securedFetch(`/categorias`, {
    method: 'POST',
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando categorías`);
  return res.json();
}

export async function postPromocion(promo: Promocion): Promise<Promocion> {
  const res = await securedFetch(`/promociones`, {
    method: 'POST',
    body: JSON.stringify(promo),
  });
  if (!res.ok) throw new Error(`Error ${res.status} guardando la promocion`);
  const raw = await res.json();
  return {
    ...raw,
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  };
}

export async function deleteProductosById(idProduc: Number): Promise<boolean> {
  const res = await securedFetch(`/articulos_manufacturados/${idProduc}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error ${res.status} al borrar el producto manufacturado`);
  return res.json();
}

export async function deleteTipoPromocionById(idTipoProm: Number): Promise<boolean> {
  const res = await securedFetch(`/tipo_promociones/${idTipoProm}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error ${res.status} al borrar el tipo de promoción`);
  return res.json();
}

export async function deletePromocionById(idProm: Number): Promise<boolean> {
  const res = await securedFetch(`/promociones/${idProm}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error ${res.status} al borrar la promoción`);
  return res.json();
}

export async function deleteCategoriaById(idCategoria: Number): Promise<boolean> {
  const res = await securedFetch(`/categorias/${idCategoria}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error ${res.status} al borrar la categoría`);
  return res.json();
}


// PUT o PATCH

export async function updateStockInsumo(
  insumoId: number,
  nuevoStock: number
): Promise<void> {
  const res = await securedFetch(`/articulos_insumos/${insumoId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stockActual: nuevoStock, sucursalId: 1 })
  });
  if (!res.ok) throw new Error(`Error ${res.status} actualizando stock`);
}

export async function loginUsuario(email: string, password: string) {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || `Error ${res.status} al iniciar sesión`);
  }

  return res.json();
}

// registro: también sin token
export async function registrarUsuario(dto: RegistroDTO) {
  const res = await fetch(`${API_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || `Error ${res.status} al registrar`);
  }
}
