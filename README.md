# 🍽️ El Buen Sabor - Frontend 

**El Buen Sabor** es un sistema web desarrollado con **React + TypeScript** que ofrece una experiencia completa tanto para clientes como para personal administrativo de un restaurante. Este frontend actúa como interfaz principal del sistema de gestión El Buen Sabor, integrándose con un backend en Java y brindando funcionalidades de e-commerce, gestión interna y visualización de datos en tiempo real.

---

## 🛠️ Tecnologías utilizadas

- **React 19.1.0** – Framework principal
- **TypeScript 5.8.3** – Tipado estático
- **Vite 6.3.5** – Bundler rápido y liviano
- **React Router DOM** – Ruteo de cliente
- **Luxon** – Manipulación de fechas y horas
- **TinyMCE** – Editor enriquecido para descripciones
- **SweetAlert2** – Alertas y diálogos interactivos
- **Google Maps API** – Servicios de geolocalización
- **Google Charts** – Visualización de analíticas
- **Mercado Pago** – Procesamiento de pagos

---

## ⚙️ Instalación y ejecución

### 📌 Requisitos previos
- Node.js 18 o superior
- npm o yarn

### ▶️ Pasos para correr la app

```bash
git clone https://github.com/FedeDAnna/El_Buen_Sabor_front.git
cd El_Buen_Sabor_front
npm install
npm run dev
```

📍 Acceder desde: `http://localhost:5173`

> ⚠️ Asegurarse de que el backend esté corriendo en `http://localhost:8080` para conectarse correctamente vía API

---

## 🧩 Estructura del sistema 

El sistema está basado en React Router y maneja el estado con Context API. Se divide en dos interfaces principales:

### 👥 Interfaz Cliente
- HomePage
- Productos por Categoría
- Detalle de Producto
- Carrito de Compras
- Detalle de Pago

### 🧑‍💼 Interfaz Administrativa
- Pantalla de Órdenes
- Gestión de Productos e Insumos
- Gestión de Promociones
- Estadísticas y reportes

---

## 🧱 Entidades principales 

- `Usuario` – Cliente, repartidor, admin
- `Pedido` – Órdenes del cliente
- `Estado` – Enum de estado del pedido
- `ArticuloManufacturado` – Productos preparados
- `ArticuloInsumo` – Insumos de cocina
- `Categoria` – Rubros jerárquicos
- `Sucursal` – Locales del restaurante
- `Promocion` – Campañas activas
- `UnidadDeMedida` – Tipos de unidad (g, ml, etc.)

---

## 🔌 Capa de integración API 

La mayor parte de la comunicación con el backend se gestiona desde `FuncionesApi.ts`, un módulo centralizado que incluye autenticación, validaciones y manejo de errores.

### Ejemplos de operaciones:
- 📦 Productos: `getArticulosManufacturados()`
- 📑 Pedidos: `savePedido()`, `updateEstadoPedido()`
- 🧑 Usuarios: `loginUsuario()`, `registrarUsuario()`
- 📊 Promociones: `postPromocion()`, `getPromocionesPorTipoPromocion()`
- 📦 Stock: `updateStockInsumo()`

> Utiliza autenticación básica (`Authorization: Basic ...`) y cabeceras JSON para todos los requests
> Utiliza autenticación y autorización mediante auth0 (En desarrollo)

---

## 🔄 Flujo de gestión de pedidos

Los pedidos progresan en tiempo real a través de los siguientes estados:

```
PENDIENTE → CONFIRMADO → EN_PREPARACION → LISTO → EN_CAMINO → ENTREGADO
```

> También se contemplan estados como `RECHAZADO` y `DEMORADO`

---

## 🔐 Seguridad y control de acceso

- Contexto de Usuario (`UserProvider`) gestiona sesión y rol
- `RutaProtegida` controla el acceso a rutas sensibles (admin, cocina, etc.)
- Se planea integración completa con **Auth0**

---

## 👨‍💻 Integrantes del grupo 

| Nombre | GitHub |
|--------|--------|
| Mauro Puebla | [@MauroPuebla02](https://github.com/MauroPuebla02) |
| Mauricio Urquiza | [@mauriciogurquiza](https://github.com/mauriciogurquiza) |
| Federico D'Anna | [@FedeDAnna](https://github.com/FedeDAnna) |
| Ailen Bossio | [@ailenBossio](https://github.com/ailenBossio) |
| Maximiliano Attanasio | [@maximilianoAttanasio](https://github.com/maximilianoAttanasio) |

---

## 📎 Repositorio
- 🔗 [El Buen Sabor - Frontend (GitHub)](https://github.com/FedeDAnna/El_Buen_Sabor_front)
- 🔗 [El Buen Sabor - Backend (GitHub)](https://github.com/MauroPuebla02/El_Buen_Sabor)
