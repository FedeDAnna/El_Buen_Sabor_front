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
import type { Estado } from "../entidades/Estado";
import type Localidad from "../entidades/Localidad";
import type { PedidoHistorialDTO } from "../DTOs/DTO/PedidoHistorialDTO";
import type RegistroDTO from "../entidades/RegistroDTO";

const API_URL = "http://localhost:8080";
const basic = btoa(`admin:admin123`);

let tokenGetter: () => Promise<string>;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

async function securedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} en ${url}: ${text}`);
  }
  return res.status !== 204 ? res.json() : undefined as unknown as T;
}

async function publicFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} en ${url}: ${text}`);
  }
  return res.status !== 204 ? res.json() : undefined as unknown as T;
}

// ==============================
// PUBLIC ROUTES
// ==============================

export async function fetchCategoriaById(idCategoria: number): Promise<Categoria> {
  return publicFetch(`/categorias/${idCategoria}`);
}

export async function findCategoriaParaVentas(): Promise<Categoria[]> {
  return publicFetch(`/categorias/ventas`);
}

export async function getTiposPromociones(): Promise<TipoPromocion[]> {
  return publicFetch(`/tipo_promociones`);
}

export async function getTipoPromocionById(id: number): Promise<TipoPromocion> {
  return publicFetch(`/tipo_promociones/${id}`);
}

export async function getPromocionById(id: number): Promise<Promocion> {
  const raw = await publicFetch<any>(`/promociones/${id}`);
  return {
    ...raw,
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  };
}

export async function getPromocionesPorTipoPromocion(idTipoPromocion: number): Promise<Promocion[]> {
  const raw = await publicFetch<any[]>(`/promociones/byTipoPromocion/${idTipoPromocion}`);
  return raw.map(p => ({
    ...p,
    fecha_desde: new Date(p.fecha_desde),
    fecha_hasta: new Date(p.fecha_hasta),
    hora_desde: DateTime.fromISO(p.hora_desde),
    hora_hasta: DateTime.fromISO(p.hora_hasta),
  }));
}

export async function loginUsuario(email: string, password: string): Promise<Usuario> {
  return publicFetch(`/usuarios/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registrarUsuario(dto: RegistroDTO): Promise<void> {
  await publicFetch(`/usuarios/registro`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// ==============================
// SECURED ROUTES
// ==============================

export async function fetchUnidadesDeMedida(): Promise<UnidadDeMedida[]> {
  return securedFetch(`/unidades_de_medidas`);
}

export async function fetchDomiciliosUsuario(): Promise<Domicilio[]> {
  return securedFetch(`/domicilios`);
}

export async function getUsuarioById(idUsuario: number): Promise<Usuario> {
  return securedFetch(`/usuarios/${idUsuario}`);
}

export async function getSucursalById(idSucursal: number): Promise<Sucursal> {
  return securedFetch(`/sucursales/${idSucursal}`);
}

export async function getArticulosManufacturadoPorCategoria(idCategoria: number): Promise<ArticuloManufacturado[]> {
  return securedFetch(`/articulos_manufacturados/byCategoria/${idCategoria}`);
}

export async function getArticulosInsumoPorCategoria(idCategoria: number): Promise<ArticuloInsumo[]> {
  return securedFetch(`/articulos_insumos/byCategoria/${idCategoria}`);
}

export async function getArticulosManufacturados(): Promise<ArticuloManufacturado[]> {
  return securedFetch(`/articulos_manufacturados`);
}

export async function getArticulosManufacturadosConInsumos(): Promise<ArticuloManufacturado[]> {
  return securedFetch(`/articulos_manufacturados/con_insumos`);
}

export async function fetchInsumos(): Promise<ArticuloInsumo[]> {
  return securedFetch(`/articulos_insumos`);
}

export async function getCategoriasByTipo(idTipo: number): Promise<Categoria[]> {
  return securedFetch(`/categorias/manufacturados/${idTipo}`);
}

export async function getArticuloManufacturadoById(id: number): Promise<ArticuloManufacturado> {
  return securedFetch(`/articulos_manufacturados/byId/${id}`);
}

export async function getArticuloInsumoById(id: number): Promise<ArticuloInsumo> {
  return securedFetch(`/articulos_insumos/${id}`);
}

export async function fetchTiposCategoria(): Promise<TipoCategoria[]> {
  return securedFetch(`/tipo_categorias`);
}

export async function getDomiciliosPorUsuario(idUsuario: number): Promise<Domicilio[]> {
  return securedFetch(`/domicilios/ByUsuario/${idUsuario}`);
}

export async function getLocalidades(): Promise<Localidad[]> {
  return securedFetch(`/localidades`);
}

export async function getSucursales(): Promise<Sucursal[]> {
  return securedFetch(`/sucursales`);
}

// POSTs

export async function postTipoPromocion(tipoPromocion: TipoPromocion): Promise<TipoPromocion> {
  return securedFetch(`/tipo_promociones`, {
    method: "POST",
    body: JSON.stringify(tipoPromocion),
  });
}

export async function savePedido(pedido: Pedido): Promise<Pedido> {
  return securedFetch(`/pedidos`, {
    method: "POST",
    body: JSON.stringify(pedido),
  });
}

export async function savePedidoMP(pedido: Pedido): Promise<{ url: string }> {
  return securedFetch(`/pagos/preference`, {
    method: "POST",
    body: JSON.stringify(pedido),
  });
}

export async function saveArticuloManufacturado(articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {
  const payload = { _type: "manufacturado" as const, ...articulo };
  return securedFetch(`/articulos_manufacturados`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveArticuloInsumo(articulo: ArticuloInsumo): Promise<ArticuloInsumo> {
  const payload = { _type: "insumo" as const, ...articulo };
  return securedFetch(`/articulos_insumos`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveDomicilio(domicilio: Domicilio): Promise<Domicilio> {
  return securedFetch(`/domicilios`, {
    method: "POST",
    body: JSON.stringify(domicilio),
  });
}

export async function guardarCategoriaConHijos(categoria: Categoria): Promise<Categoria> {
  return securedFetch(`/categorias`, {
    method: "POST",
    body: JSON.stringify(categoria),
  });
}

export async function fetchHistorialPedidosClientes(pagina: number, idUser: number): Promise<PedidoHistorialDTO[]> {
  return securedFetch(`/pedidos/byClientes/${idUser}?page=${pagina}&size=16`);
}

export async function postPromocion(promo: Promocion): Promise<Promocion> {
  const raw = await securedFetch<any>(`/promociones`, {
    method: "POST",
    body: JSON.stringify(promo),
  });
  return {
    ...raw,
    fecha_desde: new Date(raw.fecha_desde),
    fecha_hasta: new Date(raw.fecha_hasta),
    hora_desde: DateTime.fromISO(raw.hora_desde),
    hora_hasta: DateTime.fromISO(raw.hora_hasta),
  };
}

export async function saveUsuario(user: Usuario): Promise<Usuario> {
  return securedFetch(`/usuarios`, {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function saveSucursal(suc: Sucursal): Promise<Sucursal> {
  return securedFetch(`/sucursales`, {
    method: "POST",
    body: JSON.stringify(suc),
  });
}

// DELETEs

export async function deleteProductosById(idProduc: number): Promise<boolean> {
  return securedFetch(`/articulos_manufacturados/${idProduc}`, {
    method: "DELETE",
  });
}

export async function deleteTipoPromocionById(idTipoProm: number): Promise<boolean> {
  return securedFetch(`/tipo_promociones/${idTipoProm}`, {
    method: "DELETE",
  });
}

export async function deletePromocionById(idProm: number): Promise<boolean> {
  return securedFetch(`/promociones/${idProm}`, {
    method: "DELETE",
  });
}

export async function deleteCategoriaById(idCategoria: number): Promise<boolean> {
  return securedFetch(`/categorias/${idCategoria}`, {
    method: "DELETE",
  });
}

export async function deleteDomicilioById(idDomicilio: number): Promise<boolean> {
  return securedFetch(`/domicilios/${idDomicilio}`, {
    method: "DELETE",
  });
}

export async function deleteSucursalById(idSucursal: number): Promise<boolean> {
  return securedFetch(`/sucursales/${idSucursal}`, {
    method: "DELETE",
  });
}

// PUT o PATCH

export async function getPedidos(): Promise<Pedido[]> {
  const raw = await securedFetch<any[]>(`/pedidos`);
  return raw.map(p => ({
    ...p,
    fecha_pedido: DateTime.fromISO(p.fecha_pedido),
    hora_estimada_finalizacion: DateTime.fromISO(p.hora_estimada_finalizacion),
  }));
}

export async function updateEstadoPedido(id: number, nuevoEstado: Estado): Promise<void> {
  await securedFetch(`/pedidos/pedido/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ estadoPedido: nuevoEstado }),
  });
}

export async function updateStockInsumo(insumoId: number, nuevoStock: number): Promise<void> {
  await securedFetch(`/articulos_insumos/${insumoId}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stockActual: nuevoStock, sucursalId: 1 }),
  });
}

export async function obtenerUsuariosPorTipo(tipo: "empleados" | "clientes"): Promise<Usuario[]> {
  return securedFetch(`/usuarios/${tipo}`);
}

export async function obtenerRolesEmpleados(): Promise<string[]> {
  return securedFetch(`/usuarios/roles`);
}

export async function crearUsuario(nuevoUsuario: Usuario): Promise<Usuario> {
  const usuarioSinId = { ...nuevoUsuario };
  if ("id" in usuarioSinId && (usuarioSinId.id === 0 || usuarioSinId.id === undefined || usuarioSinId.id === null)) {
    delete usuarioSinId.id;
  }
  return securedFetch(`/usuarios/registrarEncriptado`, {
    method: "POST",
    body: JSON.stringify(usuarioSinId),
  });
}

export async function actualizarUsuario(id: number, datosActualizados: Usuario): Promise<Usuario> {
  return securedFetch(`/usuarios?id=${id}`, {
    method: "POST",
    body: JSON.stringify(datosActualizados),
  });
}

export async function eliminarUsuario(idUsuario: number): Promise<void> {
  await securedFetch(`/usuarios/${idUsuario}`, {
    method: "DELETE",
  });
}

export async function getPedidoPorId(id: number): Promise<Pedido> {
  const data = await securedFetch<any>(`/pedidos/${id}`);
  return {
    ...data,
    fecha_pedido: DateTime.fromISO(data.fecha_pedido),
    hora_estimada_finalizacion: DateTime.fromISO(data.hora_estimada_finalizacion),
  };
}

export async function getProductosPorPedido(pedidoId: number): Promise<any[]> {
  return securedFetch(`/pedidos/manufacturados/${pedidoId}`);
}

export async function updateRepartidorPedido(pedidoId: number): Promise<void> {
  const usuarioJson = localStorage.getItem("usuario");
  const idUsuario = usuarioJson ? JSON.parse(usuarioJson).id : 0;
  if (!usuarioJson) {
    throw new Error("No hay usuario en localStorage bajo la clave 'usuario'");
  }

  await securedFetch(`/pedidos/pedido/repartidor`, {
    method: "PUT",
    body: JSON.stringify({ idPedido: pedidoId, idDelivery: idUsuario }),
  });
}