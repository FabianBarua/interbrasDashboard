"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: "user" | "admin";
};

/**
 * Componente que muestra contenido solo si el usuario está autenticado
 * y tiene el rol requerido
 */
export function Protected({ children, fallback = null, requiredRole }: Props) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requiredRole && role !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente que muestra contenido solo para admins
 */
export function AdminOnly({ children, fallback = null }: Omit<Props, "requiredRole">) {
  return (
    <Protected requiredRole="admin" fallback={fallback}>
      {children}
    </Protected>
  );
}

/**
 * Ejemplo de uso:
 * 
 * <Protected fallback={<p>Debes iniciar sesión</p>}>
 *   <p>Contenido protegido</p>
 * </Protected>
 * 
 * <AdminOnly fallback={<p>Solo para admins</p>}>
 *   <button>Eliminar usuario</button>
 * </AdminOnly>
 */
