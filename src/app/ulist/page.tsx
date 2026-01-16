import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // REVISA QUE ESTA RUTA SEA CORRECTA
import { redirect } from "next/navigation";
import { updateUserPlan } from "@/app/actions/adminActions";

export const revalidate = 0;

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Obtenemos la sesión pasando authOptions
  const session = await getServerSession(authOptions);
  
  // LOG PARA DEPURAR: Mira tu terminal cuando cargues la página
  console.log("SESIÓN ACTUAL:", session?.user?.email);

  // 2. Seguridad de Email (IMPORTANTE: Pon tu correo real aquí)
  const ADMIN_EMAIL = "tu-correo-real@gmail.com"; 

  if (!session || session.user?.email !== ADMIN_EMAIL) {
    console.log("Redirigiendo porque no es el admin o no hay sesión");
    redirect("/"); 
  }

  // 3. Esperamos los parámetros de la URL
  const params = await searchParams;
  
  // Verificamos si existe la llave (ej: /ulist?miclave)
  // Nota: En Vercel la variable debe llamarse exactamente igual
  const hasKey = params.hasOwnProperty('miclave'); 

  if (!hasKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-300 p-4">
        <div className="alert alert-warning shadow-lg max-w-md">
          <span>⚠️ Llave de acceso no proporcionada en la URL.</span>
        </div>
      </div>
    );
  }

  // 4. Si todo está bien, traemos los usuarios
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-base-200 p-6 rounded-2xl shadow-inner">
        <div>
          <h1 className="text-3xl font-black text-primary">Panel Super Admin</h1>
          <p className="text-sm opacity-70">Logueado como: {session.user?.email}</p>
        </div>
        <div className="badge badge-secondary">{allUsers.length} Usuarios</div>
      </div>
      
      <div className="overflow-x-auto shadow-2xl rounded-3xl border border-base-300 bg-base-100">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Plan</th>
              <th className="text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <img src={user.image || ""} className="w-10 h-10 rounded-full border border-primary/20" />
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.plan === 'pro' ? 'badge-primary' : 'badge-ghost'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="text-right">
                  <form action={async () => {
                    'use server'
                    await updateUserPlan(user.id, user.plan || 'free');
                  }}>
                    <button className="btn btn-sm btn-ghost border-base-300">
                      Cambiar a {user.plan === 'pro' ? 'Free' : 'Pro'}
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
