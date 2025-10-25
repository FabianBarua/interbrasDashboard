"use server";

import { auth } from "@/auth";
import { db } from "@root/db/config";
import { Users } from "@root/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Tipos
type UserRole = "user" | "admin";

interface UserData {
  name: string;
  email: string;
  role: UserRole;
}

// Validación de seguridad
async function validateAdmin() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  const currentUser = await db.query.Users.findFirst({
    where: eq(Users.id, session.user.id),
  });

  if (currentUser?.role !== "admin") {
    throw new Error("No autorizado - Se requieren permisos de administrador");
  }

  return { session, currentUser };
}

/**
 * Obtiene todos los usuarios (solo para admins)
 */
export async function getAllUsersAction() {
  try {
    await validateAdmin();

    const users = await db.select({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      role: Users.role,
      emailVerified: Users.emailVerified,
      image: Users.image,
    }).from(Users);

    return { success: true, users };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener usuarios" 
    };
  }
}

/**
 * Crea un nuevo usuario (solo para admins)
 */
export async function createUserAction(data: UserData) {
  try {
    await validateAdmin();

    // Validar datos
    if (!data.name || !data.email) {
      throw new Error("Nombre y email son requeridos");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Email inválido");
    }

    // Verificar si el email ya existe
    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.email, data.email),
    });

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Crear usuario
    const [newUser] = await db
      .insert(Users)
      .values({
        name: data.name,
        email: data.email,
        role: data.role || "user",
      } as any)
      .returning();

    revalidatePath("/admin/users");
    
    return { 
      success: true, 
      user: newUser,
      message: "Usuario creado exitosamente" 
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al crear usuario" 
    };
  }
}

/**
 * Actualiza un usuario existente (solo para admins)
 */
export async function updateUserAction(userId: string, data: UserData) {
  try {
    const { session } = await validateAdmin();

    // Validar datos
    if (!data.name || !data.email) {
      throw new Error("Nombre y email son requeridos");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Email inválido");
    }

    // Verificar si el email ya existe en otro usuario
    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.email, data.email),
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error("El email ya está registrado por otro usuario");
    }

    // No permitir que un admin se quite sus propios permisos
    if (userId === session.user.id && data.role === "user") {
      throw new Error("No puedes quitarte tus propios permisos de administrador");
    }

    // Actualizar usuario
    const [updatedUser] = await db
      .update(Users)
      .set({
        name: data.name,
        email: data.email,
        role: data.role,
      } as any)
      .where(eq(Users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    revalidatePath("/admin/users");
    
    return { 
      success: true, 
      user: updatedUser,
      message: "Usuario actualizado exitosamente" 
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al actualizar usuario" 
    };
  }
}

/**
 * Elimina un usuario (solo para admins)
 */
export async function deleteUserAction(userId: string) {
  try {
    const { session } = await validateAdmin();

    // No permitir que un admin se elimine a sí mismo
    if (userId === session.user.id) {
      throw new Error("No puedes eliminarte a ti mismo");
    }

    // Verificar que el usuario existe
    const userToDelete = await db.query.Users.findFirst({
      where: eq(Users.id, userId),
    });

    if (!userToDelete) {
      throw new Error("Usuario no encontrado");
    }

    // Eliminar usuario
    await db.delete(Users).where(eq(Users.id, userId));

    revalidatePath("/admin/users");
    
    return { 
      success: true,
      message: "Usuario eliminado exitosamente" 
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar usuario" 
    };
  }
}

/**
 * Obtiene la información del usuario actual
 */
export async function getCurrentUser() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("No autenticado");
    }

    const user = await db.query.Users.findFirst({
      where: eq(Users.id, session.user.id),
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener usuario" 
    };
  }
}
