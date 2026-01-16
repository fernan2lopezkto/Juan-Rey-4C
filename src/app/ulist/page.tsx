import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { updateUserPlan } from "@/app/actions/adminActions";

export const revalidate = 0;

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // 1. Verificación de Email (Seguridad Nivel 1)
  if (!session || session.user?.email !== "tu-correo@gmail.com") {
    redirect("/"); 
  }

  // 2. Verificación de Llave en URL (Seguridad Nivel 2)
  // Comprueba si existe la propiedad 'miclave' en la URL
  const hasKey = params.hasOwnProperty('miclave'); 
  if (!hasKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-300">
        <div className="alert alert-error shadow-lg w-auto">
          <span>⚠️ Acceso restringido. Se requiere llave de administrador.</span>
        </div>
      </div>
    );
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-black text-primary mb-2">Admin Panel</h1>
        <p className="opacity-60">Gestionando {allUsers.length} usuarios registrados</p>
      </header>
      
      <div className="overflow-x-auto shadow-2xl rounded-3xl border border-base-300 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Usuario</th>
              <th>Plan Actual</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={user.image || "/api/placeholder/48/48"} alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge font-bold p-3 ${user.plan === 'pro' ? 'badge-primary' : 'badge-ghost'}`}>
                    {user.plan?.toUpperCase() || 'FREE'}
                  </span>
                </td>
                <td className="text-center">
                  <form action={async () => {
                    'use server'
                    await updateUserPlan(user.id, user.plan || 'free');
                  }}>
                    <button className={`btn btn-sm md:btn-md ${user.plan === 'pro' ? 'btn-outline btn-error' : 'btn-primary'}`}>
                      {user.plan === 'pro' ? 'Degradar a Free' : 'Subir a Pro'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
