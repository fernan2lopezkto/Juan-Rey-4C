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
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  // 1. Verificación de Email (Solo TÚ)
  if (!session || session.user?.email !== "fernan2lopezkto@gmail.com") {
    redirect("/"); // Si no eres tú, fuera.
  }

  // 2. Verificación de Contraseña vía URL (ej: /ulist?key=tu_password)
  const adminKey = (await searchParams).key;
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="alert alert-error w-96">
          <span>Acceso denegado: Llave de administrador incorrecta.</span>
        </div>
      </div>
    );
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Súper Mega Panel de Control
      </h1>
      
      <div className="overflow-x-auto shadow-2xl rounded-3xl border border-base-300">
        <table className="table w-full bg-base-100">
          <thead className="bg-neutral text-neutral-content">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Plan Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-base-200 transition-colors">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-hexagon w-12 h-12">
                        <img src={user.image || ""} alt="Avatar" />
                      </div>
                    </div>
                    <div className="font-bold">{user.name}</div>
                  </div>
                </td>
                <td className="opacity-70">{user.email}</td>
                <td>
                  <div className={`badge ${user.plan === 'pro' ? 'badge-primary' : 'badge-ghost'} font-bold`}>
                    {user.plan?.toUpperCase()}
                  </div>
                </td>
                <td>
                   <form action={async (formData) => {
                     'use server'
                     const nextPlan = user.plan === 'pro' ? 'free' : 'pro';
                     await updateUserPlan(user.id, nextPlan);
                   }}>
                     <button className={`btn btn-sm ${user.plan === 'pro' ? 'btn-outline' : 'btn-primary'}`}>
                       Hacer {user.plan === 'pro' ? 'FREE' : 'PRO'}
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
