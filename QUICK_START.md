# 🚀 Inicio Rápido - Sistema de Autenticación y Roles

## ✅ ¿Qué se ha configurado?

1. **Base de datos actualizada** con tablas de usuarios, cuentas y sesiones
2. **NextAuth configurado** con adaptador de Drizzle
3. **Sistema de roles** (user/admin) implementado
4. **Middleware** actualizado para proteger rutas
5. **Server Actions** para gestionar usuarios
6. **Componentes React** para UI de gestión

## 📝 Pasos para Empezar

### 1. Verifica que las migraciones se aplicaron

Las migraciones ya se ejecutaron, pero puedes verificar con:

```bash
pnpm drizzle-kit studio --config=drizzle-prod.config.ts
```

Esto abrirá una interfaz visual de tu base de datos.

### 2. Inicia Sesión en la Aplicación

Ve a `/login` y autentícate con Google o GitHub. El usuario se creará automáticamente en la base de datos con rol "user".

### 3. Haz Admin a tu Usuario

**Opción A: Usando el script (Recomendado)**

```bash
pnpm make-admin tu-email@gmail.com
```

**Opción B: Manualmente en la base de datos**

Abre Drizzle Studio y actualiza el campo `role` de tu usuario a "admin".

**Opción C: SQL directo**

```sql
UPDATE user SET role = 'admin' WHERE email = 'tu-email@gmail.com';
```

### 4. Accede al Panel de Admin

Ve a `/admin/users` para ver y gestionar todos los usuarios.

## 🎯 Casos de Uso Comunes

### Verificar rol en Server Component

```typescript
import { auth } from "@/auth";

export default async function MyPage() {
  const session = await auth();
  
  if (session?.user?.role === "admin") {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
}
```

### Verificar rol en Client Component

```typescript
"use client";
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { isAdmin, user } = useAuth();
  
  return (
    <div>
      {isAdmin && <button>Acción de Admin</button>}
      <p>Hola, {user?.name}</p>
    </div>
  );
}
```

### Usar componentes de protección

```typescript
import { AdminOnly } from "@/components/Protected";

export function MyPage() {
  return (
    <div>
      <h1>Mi Página</h1>
      
      <AdminOnly fallback={<p>Solo para admins</p>}>
        <button>Eliminar todo</button>
      </AdminOnly>
    </div>
  );
}
```

### Proteger Server Actions

```typescript
"use server";
import { auth } from "@/auth";
import { isUserAdmin } from "@/lib/user-management";

export async function deleteUser(userId: string) {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }
  
  const isAdmin = await isUserAdmin(session.user.id);
  
  if (!isAdmin) {
    return { error: "Permiso denegado" };
  }
  
  // Tu lógica aquí...
}
```

## 🔧 Archivos Importantes

- `src/auth.ts` - Configuración de NextAuth
- `src/middleware.ts` - Protección de rutas
- `db/schema.ts` - Esquema de base de datos
- `src/lib/user-management.ts` - Funciones de gestión de usuarios
- `src/app/actions/users.ts` - Server Actions
- `src/components/UserManagement.tsx` - UI de gestión
- `src/hooks/useAuth.ts` - Hook para verificar auth en cliente

## 🛡️ Rutas Protegidas

Por defecto, estas rutas requieren rol de admin:
- `/admin/*`
- `/dashboard/*`

Para agregar más rutas protegidas, edita `src/middleware.ts`:

```typescript
const ADMIN_ROUTES = [
  '/admin',
  '/dashboard',
  '/settings', // Agregar aquí
];
```

## 📚 Funciones Disponibles

### Gestión de Usuarios

```typescript
import {
  getUserByEmail,
  getUserById,
  updateUserRole,
  getAllUsers,
  getUsersByRole,
  isUserAdmin
} from "@/lib/user-management";

// Ejemplos
const user = await getUserByEmail("test@example.com");
await updateUserRole(user.id, "admin");
const allAdmins = await getUsersByRole("admin");
```

### Server Actions

```typescript
import {
  getUsers,
  changeUserRole,
  getCurrentUser,
  getAdmins
} from "@/app/actions/users";

// En un componente de servidor
const result = await getUsers();
```

## ⚡ Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Hacer admin a un usuario
pnpm make-admin email@example.com

# Ver base de datos
pnpm drizzle-kit studio --config=drizzle-prod.config.ts

# Generar migraciones
pnpm drizzle-kit generate --config=drizzle-prod.config.ts

# Aplicar migraciones
pnpm drizzle-kit push --config=drizzle-prod.config.ts
```

## 🎨 Próximos Pasos

1. ✅ Personaliza los roles según tus necesidades
2. ✅ Agrega más rutas protegidas
3. ✅ Crea páginas de admin adicionales
4. ✅ Implementa logs de actividad de usuarios
5. ✅ Agrega más proveedores OAuth si lo necesitas

## 💡 Tips

- **Roles personalizados**: Puedes extender el tipo `Role` en `src/next-auth.d.ts`
- **Permisos granulares**: Considera crear una tabla de permisos si necesitas más control
- **Auditoría**: Agrega timestamps y logs para rastrear cambios de roles
- **Notificaciones**: Envía emails cuando cambia el rol de un usuario

## 🐛 Solución de Problemas

### El usuario no se crea en la BD
- Verifica que las migraciones se aplicaron correctamente
- Revisa las variables de entorno de la BD

### No puedo acceder a rutas de admin
- Asegúrate de que tu usuario tenga rol "admin" en la BD
- Cierra sesión y vuelve a iniciar para refrescar la sesión

### Errores de tipos en TypeScript
- Ejecuta `pnpm install` para asegurar todas las dependencias
- Reinicia el servidor de desarrollo

---

¿Preguntas? Revisa `AUTH_ROLES_GUIDE.md` para documentación más detallada.
