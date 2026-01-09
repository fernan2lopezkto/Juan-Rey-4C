import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UsersListPage() {
  // 1. Verificamos la sesión en el servidor
  const session = await getServerSession(authOptions);

  // 2. Si no hay sesión, redirigimos al login de Google inmediatamente
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Opcional: Si quieres que SOLO TÚ (por tu correo) veas la lista
  // if (session.user?.email !== "tu-correo@gmail.com") {
  //   return <div className="p-8 text-center">No tienes permiso para ver esto.</div>;
  // }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Panel de Control: Usuarios
      </h1>
      
      <div className="overflow-x-auto shadow-xl rounded-box border border-base-300">
        <table className="table w-full bg-base-100">
          <thead className="bg-secondary text-secondary-content">
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="hover">
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-10 h-10">
                      <img src={user.image || ""} alt="Avatar" />
                    </div>
                  </div>
                </td>
                <td className="font-bold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
