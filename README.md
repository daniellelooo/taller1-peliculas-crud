# 🎬 Catálogo de Películas — Taller #1

CRUD completo de películas con **NestJS + Prisma 7 + SQLite** en el backend y **Vue 3 + Vite** en el frontend, con autenticación por **JWT**.

| Proyecto | Carpeta | Stack | Puerto |
| --- | --- | --- | --- |
| API REST | [`backend/`](backend) | NestJS 12, Prisma 7, SQLite, Passport JWT | `3000` |
| Interfaz web | [`frontend/`](frontend) | Vue 3, Vite, Vue Router, Pinia, Axios | `5173` |

---

## Requisitos

- Node.js 20 o superior (se probó con 22)
- npm 10 o superior

> ⚠️ **Importante:** clona el repositorio en una ruta **sin el carácter `#`**. Vite (el bundler de Vue) falla si alguna carpeta de la ruta contiene `#`.

---

## 1. Backend (API de NestJS)

```bash
cd backend
npm install            # tambien genera el cliente de Prisma (postinstall)
cp .env.example .env
npx prisma generate    # por si el postinstall no corrio
npx prisma migrate dev # crea dev.db y aplica las migraciones
npm run prisma:seed    # carga 12 peliculas y el usuario de prueba
npm run start:dev
```

La API queda en **http://localhost:3000/api**.

El seed crea 12 películas y un usuario de prueba:

| Correo | Contraseña |
| --- | --- |
| `demo@peliculas.com` | `demo1234` |

### Variables de entorno (`backend/.env`)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | Ruta del archivo SQLite | `file:./dev.db` |
| `JWT_SECRET` | Clave con la que se firma el token | `un-secreto-largo-y-aleatorio` |
| `JWT_EXPIRES_IN` | Vigencia del token | `1d` |
| `PORT` | Puerto de la API | `3000` |
| `CORS_ORIGIN` | Origen permitido del frontend | `http://localhost:5173` |

### Scripts útiles

| Comando | Qué hace |
| --- | --- |
| `npm run start:dev` | Levanta la API con recarga automática |
| `npm run build` | Compila a `dist/` |
| `npm test` | Pruebas unitarias |
| `npm run test:e2e` | Pruebas end-to-end |
| `npm run prisma:migrate` | Crea y aplica una migración |
| `npm run prisma:seed` | Carga los datos de ejemplo |
| `npm run prisma:studio` | Abre Prisma Studio para ver la base |

---

## 2. Frontend (Vue)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La interfaz queda en **http://localhost:5173** y consume la API mediante `VITE_API_URL`.

---

## Endpoints de la API

Base: `http://localhost:3000/api`

### Autenticación

| Método | Ruta | Protegido | Descripción |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Registra un usuario (guarda la contraseña hasheada con bcrypt) |
| `POST` | `/auth/login` | No | Valida credenciales y devuelve un JWT firmado |
| `GET` | `/auth/me` | Sí | Devuelve el usuario dueño del token |

### Películas

| Método | Ruta | Protegido | Descripción |
| --- | --- | --- | --- |
| `GET` | `/movies?search=&page=&limit=` | No | Listado con búsqueda por nombre y paginación |
| `GET` | `/movies/:id` | No | Detalle de una película |
| `POST` | `/movies` | Sí | Crea una película |
| `PATCH` | `/movies/:id` | Sí | Edita una película |
| `DELETE` | `/movies/:id` | Sí | Elimina una película |

Los endpoints protegidos exigen el header:

```
Authorization: Bearer <token>
```

El contrato completo (cuerpos de petición, respuestas y códigos de error) está en [`docs/API.md`](docs/API.md).

---

## Modelo de datos

```prisma
model Movie {
  id        Int      @id @default(autoincrement())
  nombre    String
  imagen    String
  director  String?
  anio      Int?
  genero    String?
  sinopsis  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id        Int      @id @default(autoincrement())
  nombre    String
  email     String   @unique
  password  String   // hash bcrypt, nunca la contraseña en texto plano
  createdAt DateTime @default(now())
}
```

---

## Estructura del repositorio

```
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/         # Migraciones versionadas
│   │   ├── schema.prisma       # Modelos Movie y User
│   │   └── seed.ts             # Datos de ejemplo
│   ├── prisma.config.ts        # Configuración de Prisma 7
│   └── src/
│       ├── auth/               # Registro, login, JWT y Guard
│       ├── movies/             # CRUD generado con `nest g resource`
│       ├── prisma/             # PrismaService (driver adapter SQLite)
│       └── main.ts
├── frontend/                   # Aplicación Vue 3
└── docs/API.md                 # Contrato detallado de la API
```
