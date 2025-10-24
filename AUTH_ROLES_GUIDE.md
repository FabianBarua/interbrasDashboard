# Sistema de Autenticación y Roles

Este proyecto ahora incluye un sistema completo de autenticación con NextAuth y gestión de roles usando Drizzle ORM.

## 📋 Características

- ✅ Autenticación con Google y GitHub
- ✅ Usuarios sincronizados automáticamente en la base de datos
- ✅ Sistema de roles (user/admin)
- ✅ Protección de rutas por roles
- ✅ Gestión de usuarios desde el código

## 🗄️ Estructura de Base de Datos

### Tablas Creadas

- **user**: Almacena información de usuarios
  - `id`: UUID único
  - `name`: Nombre del usuario
  - `email`: Email (único)
  - `emailVerified`: Timestamp de verificación
  - `image`: URL de la imagen de perfil
  - `role`: Rol del usuario ('user' | 'admin')

- **account**: Vincula usuarios con proveedores OAuth
- **session**: Gestiona sesiones de usuarios
- **verificationToken**: Tokens de verificación

## 🚀 Uso

### 1. Obtener el Usuario Actual

```typescript
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <p>Usuario: {session.user.email}</p>
      <p>Rol: {session.user.role}</p>
    </div>
  );
}
```

### 2. Proteger Rutas por Rol

El middleware ya está configurado para proteger rutas de admin. Edita `src/middleware.ts`:

```typescript
const ADMIN_ROUTES = [
  '/admin',
  '/dashboard',
  // Agrega aquí las rutas que requieren admin
];
```

### 3. Gestionar Roles desde el Código

```typescript
import { updateUserRole } from "@/lib/user-management";

// Cambiar un usuario a admin
await updateUserRole(userId, 'admin');

// Cambiar un usuario a user
await updateUserRole(userId, 'user');
```

### 4. Verificar Roles en Server Actions

```typescript
"use server";

import { auth } from "@/auth";
import { isUserAdmin } from "@/lib/user-management";

export async function adminAction() {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }

  const isAdmin = await isUserAdmin(session.user.id);
  
  if (!isAdmin) {
    return { error: "No tienes permisos de admin" };
  }

  // Tu lógica aquí...
}
```

### 5. Usar el Componente de Gestión de Usuarios

Crea una página de admin:

```typescript
// src/app/admin/users/page.tsx
import { UserManagement } from "@/components/UserManagement";

export default function UsersPage() {
  return (
    <div>
      <h1>Panel de Administración</h1>
      <UserManagement />
    </div>
  );
}
```

## 🔧 Funciones Disponibles

### En `src/lib/user-management.ts`:

- `getUserByEmail(email: string)` - Obtiene un usuario por email
- `getUserById(id: string)` - Obtiene un usuario por ID
- `updateUserRole(userId: string, role: Role)` - Actualiza el rol de un usuario
- `getAllUsers()` - Obtiene todos los usuarios
- `getUsersByRole(role: Role)` - Obtiene usuarios por rol
- `userHasRole(userId: string, role: Role)` - Verifica si un usuario tiene un rol
- `isUserAdmin(userId: string)` - Verifica si un usuario es admin

### En `src/app/actions/users.ts`:

- `getUsers()` - Obtiene todos los usuarios (solo admins)
- `changeUserRole(userId, newRole)` - Cambia el rol de un usuario (solo admins)
- `getCurrentUser()` - Obtiene la información del usuario actual
- `getAdmins()` - Obtiene todos los administradores

## 🎯 Crear el Primer Admin

Para crear tu primer usuario admin, sigue estos pasos:

1. Inicia sesión en la aplicación
2. Verifica tu email en la base de datos
3. Ejecuta este script o usa Drizzle Studio:

```typescript
// scripts/make-admin.ts
import { updateUserRole, getUserByEmail } from "@/lib/user-management";

const email = "tu-email@gmail.com";
const user = await getUserByEmail(email);

if (user) {
  await updateUserRole(user.id, 'admin');
  console.log("Usuario actualizado a admin");
}
```

O directamente en la base de datos:

```sql
UPDATE user SET role = 'admin' WHERE email = 'tu-email@gmail.com';
```

## 🔐 Configuración de Seguridad

### Variables de Entorno Necesarias

Asegúrate de tener estas variables en tu `.env`:

```env
# OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GITHUB_ID=tu_github_id
GITHUB_SECRET=tu_github_secret

# Database
DATABASE_URL=tu_database_url
DATABASE_AUTH_TOKEN=tu_auth_token

# NextAuth
AUTH_SECRET=tu_secret_key # Genera uno con: openssl rand -base64 32
```

## 📝 Notas Importantes

1. **Primer Admin**: Necesitas crear manualmente el primer admin en la base de datos
2. **Sesiones**: Las sesiones se almacenan en la base de datos para mejor control
3. **Sincronización**: Los usuarios se crean automáticamente al hacer login
4. **Roles por Defecto**: Todos los nuevos usuarios tienen rol 'user'

## 🛠️ Comandos Útiles

```bash
# Generar migraciones
pnpm drizzle-kit generate --config=drizzle-prod.config.ts

# Aplicar migraciones
pnpm drizzle-kit push --config=drizzle-prod.config.ts

# Abrir Drizzle Studio (interfaz visual de BD)
pnpm drizzle-kit studio --config=drizzle-prod.config.ts
```

## 📚 Recursos

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Adapter](https://authjs.dev/reference/adapter/drizzle)
