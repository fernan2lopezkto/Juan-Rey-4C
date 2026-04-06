import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EmailForm from "@/components/ulist/EmailForm";
import { ADMIN_EMAILS } from "@/utils/admin";
import { UlistProvider } from "@/components/ulist/UlistContext";
import UserRow from "@/components/ulist/UserRow";

export const revalidate = 0;

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // 1. Validación de sesión y correo (Nivel 1)
  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/");
  }

  // 2. Validación de Password (Nivel 2)
  const inputPass = params.pass;
  const secretPass = process.env.ADMIN_PASSWORD;

  if (inputPass !== secretPass) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-300 p-6">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-primary">Admin Access</h2>
            <form className="form-control mt-4 gap-4">
              <input 
                type="password" 
                name="pass" 
                placeholder="Contraseña secreta" 
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full text-white">
                Entrar al Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <UlistProvider>
      <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Súper Panel
            </h1>
            <p className="text-base opacity-60 mt-1">Gestionando {allUsers.length} cuentas de JR 4C</p>
          </div>
          <div className="flex gap-4">
            <div className="stat bg-base-100 rounded-3xl shadow-xl border border-base-200 py-3 px-8">
              <div className="stat-title text-xs font-bold uppercase opacity-50">Usuarios Premium</div>
              <div className="stat-value text-3xl text-primary">
                {allUsers.filter(u => !['basic', 'free'].includes(u.plan)).length}
              </div>
            </div>
          </div>
        </header>
        
        <div className="overflow-x-auto shadow-2xl rounded-[2.5rem] border border-base-200 bg-base-100">
          <table className="table table-lg w-full">
            <thead className="bg-base-200/50">
              <tr className="text-base-content/70">
                <th className="py-6">Usuario</th>
                <th>Plan Actual</th>
                <th className="text-center">Cambiar Plan</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 bg-base-100 p-8 rounded-[2.5rem] shadow-xl border border-base-200">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Comunicación Directa
          </h2>
          <EmailForm users={allUsers.map((u) => ({ email: u.email, name: u.name }))} />
        </div>
      </div>
    </UlistProvider>
  );
}

