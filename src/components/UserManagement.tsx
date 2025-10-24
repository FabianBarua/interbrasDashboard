"use client";

import { useEffect, useState } from "react";
import { getUsers, changeUserRole } from "@/app/actions/users";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const result = await getUsers();
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.users) {
      setUsers(result.users as User[]);
    }
    
    setLoading(false);
  }

  async function handleRoleChange(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const result = await changeUserRole(userId, newRole);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Rol actualizado a ${newRole}`);
      await loadUsers(); // Recargar la lista
    }
  }

  if (loading) {
    return <div className="p-4">Cargando usuarios...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.name || "Sin nombre"}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Cambiar a {user.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
