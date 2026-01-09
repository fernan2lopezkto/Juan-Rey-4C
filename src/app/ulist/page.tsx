import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

// Forzamos que no se guarde en caché para ver los usuarios nuevos al instante
export const revalidate = 0;

export default async function UsersListPage() {
  // Consultamos todos los usuarios ordenados por el más reciente
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Usuarios Registrados</h1>
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full bg-base-100">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th className="p-4 text-left">Foto</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Registro</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b border-base-200 hover:bg-base-200">
                <td className="p-4">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name ?? 'User'} 
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      ?
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{user.name || "Sin nombre"}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No hay usuarios registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        Total: {allUsers.length} usuarios
      </div>
    </div>
  );
}
