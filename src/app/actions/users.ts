"use server";

import { auth } from "@/auth";
import { 
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  getUsersByRole,
  isUserAdmin 
} from "@/lib/user-management";
import { revalidatePath } from "next/cache";

/**
 * Obtiene todos los usuarios (solo para admins)
 */
export async function getUsers() {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }

  // Verificar si el usuario es admin
  const isAdmin = await isUserAdmin(session.user.id);
  
  if (!isAdmin) {
    return { error: "No tienes permisos para ver usuarios" };
  }

  try {
    const users = await getAllUsers();
    return { users };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { error: "Error al obtener usuarios" };
  }
}

/**
 * Cambia el rol de un usuario (solo para admins)
 */
export async function changeUserRole(userId: string, newRole: 'user' | 'admin') {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }

  // Verificar si el usuario es admin
  const isAdmin = await isUserAdmin(session.user.id);
  
  if (!isAdmin) {
    return { error: "No tienes permisos para cambiar roles" };
  }

  // No permitir que un admin se quite sus propios permisos
  if (userId === session.user.id && newRole === 'user') {
    return { error: "No puedes quitarte tus propios permisos de admin" };
  }

  try {
    const updatedUser = await updateUserRole(userId, newRole);
    revalidatePath('/admin/users'); // Revalidar la página de usuarios si existe
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error al cambiar rol:", error);
    return { error: "Error al cambiar el rol del usuario" };
  }
}

/**
 * Obtiene la información del usuario actual
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }

  try {
    const user = await getUserById(session.user.id);
    return { user };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return { error: "Error al obtener información del usuario" };
  }
}

/**
 * Obtiene todos los admins
 */
export async function getAdmins() {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "No autenticado" };
  }

  try {
    const admins = await getUsersByRole('admin');
    return { admins };
  } catch (error) {
    console.error("Error al obtener admins:", error);
    return { error: "Error al obtener administradores" };
  }
}
