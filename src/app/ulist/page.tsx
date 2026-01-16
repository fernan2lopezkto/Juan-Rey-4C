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

  // 1. Validación de sesión y correo (Nivel 1)
  const ADMIN_EMAIL = "fernan2lopezkto@gmail.com"; // CAMBIA ESTO
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // 2. Validación de Password (Nivel 2)
  // Ahora buscamos ?pass=... en la URL
  const inputPass = params.pass;
  const secretPass = process.env.ADMIN_PASSWORD; // "miclave" en Vercel

  if (inputPass !== secretPass) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-300 p-6">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-primary">Admin Access</h2>
            <p className="text-sm opacity-70">Introduce la clave maestra para continuar.</p>
            <form className="form-control mt-4 gap-4">
              <input 
                type="password" 
                name="pass" 
                placeholder="Contraseña secreta" 
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Entrar al Panel
              </button>
            </form>
            {inputPass && <p className="text-error text-xs mt-2 text-center">Clave incorrecta</p>}
          </div>
        </div>
      </div>
    );
  }

  // 3. Si el password es correcto, mostramos la tabla
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-primary">Súper Panel</h1>
          <p className="text-sm opacity-50">Gestionando {allUsers.length} cuentas</p>
        </div>
        <div className="flex gap-2">
          <div className="stat bg-base-100 rounded-2xl shadow border border-base-300 py-2 px-6">
            <div className="stat-title text-xs">Usuarios PRO</div>
            <div className="stat-value text-2xl text-secondary">
              {allUsers.filter(u => u.plan === 'pro').length}
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-2xl rounded-[2rem] border border-base-300 bg-base-100">
        <table className="table table-lg w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Usuario</th>
              <th>Estado del Plan</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-base-200/50">
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar online">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user.image || ""} alt="avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`badge badge-lg gap-2 ${user.plan === 'pro' ? 'badge-primary' : 'badge-ghost opacity-50'}`}>
                    {user.plan === 'pro' ? '⭐ PREMIUM' : 'GRATIS'}
                  </div>
                </td>
                <td className="text-center">
                  <form action={async () => {
                    'use server'
                    await updateUserPlan(user.id, user.plan || 'free');
                  }}>
                    <button className={`btn btn-sm md:btn-md rounded-xl ${user.plan === 'pro' ? 'btn-outline btn-error' : 'btn-primary'}`}>
                      {user.plan === 'pro' ? 'Quitar Pro' : 'Dar acceso PRO'}
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
