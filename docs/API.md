# Contrato de la API

Base URL: `http://localhost:3000/api`

Todas las respuestas son JSON. Los endpoints protegidos requieren el header
`Authorization: Bearer <access_token>`.

---

## Autenticación

### `POST /auth/register`

Crea un usuario. La contraseña se guarda hasheada con bcrypt (10 rondas).

**Body**

```json
{
  "nombre": "Ana Perez",
  "email": "ana@correo.com",
  "password": "secreto123"
}
```

| Campo | Reglas |
| --- | --- |
| `nombre` | Texto obligatorio, máximo 80 caracteres |
| `email` | Correo válido y único |
| `password` | Mínimo 6 caracteres, máximo 72 |

**201 Created**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "ana@correo.com", "nombre": "Ana Perez" }
}
```

**Errores**

| Código | Cuándo |
| --- | --- |
| `400` | Validación fallida (`message` es un arreglo de textos) |
| `409` | El correo ya está registrado |

---

### `POST /auth/login`

**Body**

```json
{ "email": "ana@correo.com", "password": "secreto123" }
```

**200 OK** — misma forma que `register`.

**Errores**

| Código | Cuándo |
| --- | --- |
| `400` | Validación fallida |
| `401` | Credenciales inválidas |

---

### `GET /auth/me` 🔒

Sirve para revalidar la sesión al recargar el frontend.

**200 OK**

```json
{ "id": 1, "email": "ana@correo.com", "nombre": "Ana Perez" }
```

**401** si el token falta, expiró o es inválido.

---

## Películas

### `GET /movies`

**Query params**

| Parámetro | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `search` | string | — | Filtra por coincidencia parcial en `nombre` |
| `page` | número ≥ 1 | `1` | Página solicitada |
| `limit` | número 1–50 | `8` | Elementos por página |

**200 OK**

```json
{
  "data": [
    {
      "id": 3,
      "nombre": "Matrix",
      "imagen": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "director": "Lana y Lilly Wachowski",
      "anio": 1999,
      "genero": "Ciencia ficcion",
      "sinopsis": "Un programador descubre que la realidad es una simulacion.",
      "createdAt": "2026-09-05T16:00:18.129Z",
      "updatedAt": "2026-09-05T16:00:18.129Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "limit": 8, "totalPages": 2 }
}
```

> El listado se ordena por fecha de creación descendente: lo más nuevo aparece primero.

---

### `GET /movies/:id`

**200 OK** con el objeto película. **404** si no existe.

---

### `POST /movies` 🔒

**Body**

```json
{
  "nombre": "Dune: Parte Dos",
  "imagen": "https://ejemplo.com/dune.jpg",
  "director": "Denis Villeneuve",
  "anio": 2024,
  "genero": "Ciencia ficcion",
  "sinopsis": "Paul Atreides se une a los Fremen."
}
```

| Campo | Obligatorio | Reglas |
| --- | --- | --- |
| `nombre` | Sí | Texto, máximo 120 caracteres |
| `imagen` | Sí | Debe ser una URL válida |
| `director` | No | Texto, máximo 120 |
| `anio` | No | Entero entre 1888 y 2100 |
| `genero` | No | Texto, máximo 60 |
| `sinopsis` | No | Texto, máximo 1000 |

**201 Created** con la película creada.

---

### `PATCH /movies/:id` 🔒

Acepta cualquier subconjunto de los campos de `POST`.

**200 OK** con la película actualizada. **404** si no existe.

---

### `DELETE /movies/:id` 🔒

**200 OK**

```json
{ "id": 13, "eliminado": true }
```

**404** si no existe.

---

## Formato de errores

Nest responde con la forma estándar:

```json
{
  "message": ["El nombre es obligatorio", "La imagen debe ser una URL valida"],
  "error": "Bad Request",
  "statusCode": 400
}
```

Cuando el error no viene de validación, `message` es un texto simple:

```json
{ "message": "No existe la pelicula con id 9999", "error": "Not Found", "statusCode": 404 }
```

---

## Ejemplos con curl

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@peliculas.com","password":"demo1234"}' | jq -r .access_token)

# Listar con búsqueda y paginación
curl "http://localhost:3000/api/movies?search=ma&page=1&limit=5"

# Crear
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Dune","imagen":"https://ejemplo.com/dune.jpg","anio":2021}'

# Editar
curl -X PATCH http://localhost:3000/api/movies/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"genero":"Epica espacial"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/movies/1 \
  -H "Authorization: Bearer $TOKEN"
```
