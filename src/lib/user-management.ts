import { db } from "../../db/config";
import { Users } from "../../db/schema";
import { eq, SQL } from "drizzle-orm";

type Role = 'user' | 'admin';

/**
 * Obtiene un usuario por su email
 */
export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);
  
  return user;
}

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(Users)
    .where(eq(Users.id, id))
    .limit(1);
  
  return user;
}

/**
 * Actualiza el rol de un usuario
 */
export async function updateUserRole(userId: string, role: Role) {
  const [updated] = await db
    .update(Users)
    .set({ role } as any)
    .where(eq(Users.id, userId))
    .returning();
  
  return updated;
}

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsers() {
  return await db.select().from(Users);
}

/**
 * Obtiene usuarios por rol
 */
export async function getUsersByRole(role: Role) {
  return await db
    .select()
    .from(Users)
    .where(eq(Users.role, role));
}

/**
 * Verifica si un usuario tiene un rol específico
 */
export async function userHasRole(userId: string, role: Role): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === role;
}

/**
 * Verifica si un usuario es admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  return userHasRole(userId, 'admin');
}
