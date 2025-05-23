# 🧠 Proyecto Backend - Entrega Final

Este proyecto corresponde a la entrega final del curso de Backend. Implementa un sistema de gestión de productos y carritos utilizando **MongoDB** como sistema de persistencia y **Express.js** como framework backend. También incluye vistas con Handlebars y funcionalidades avanzadas como paginación, filtrado y ordenamiento.

---

## 🚀 Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Handlebars
- mongoose-paginate-v2

---

## 🔗 Endpoints principales

### Productos (`/api/products`)
- `GET /api/products`: Devuelve productos paginados.
  - Query Params soportados:
    - `limit`: número de productos por página
    - `page`: número de página
    - `sort`: `asc` o `desc` por precio
    - `query`: categoría o disponibilidad (`true` / `false`)

### Carrito (`/api/carts`)
- `GET /api/carts/:cid/view`: Muestra un carrito con productos `populate()`.
- `DELETE /api/carts/:cid`: Elimina todos los productos del carrito.
- `DELETE /api/carts/:cid/products/:pid`: Elimina un producto específico.
- `PUT /api/carts/:cid/products/:pid`: Actualiza cantidad de un producto.
- `PUT /api/carts/:cid`: Reemplaza todos los productos del carrito.
- `POST /api/carts/:cid/purchase`: Confirma la compra (opcional extra).

---

## 🖼️ Vistas
- `/products`: Muestra productos con paginación y opción de agregarlos al carrito.
- `/carts/:cid`: Muestra productos agregados a un carrito específico.

---

## 📦 Instalación

```bash
npm install
npm start
