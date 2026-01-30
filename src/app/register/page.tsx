"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import action from "./action";
import z from "zod";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(3, "Mínimo 3 caracteres"),
});

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const schemaResult = schema.safeParse({ email, password, name });
      if (!schemaResult.success) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      const res = await action(schemaResult.data);
      if (!res.status) {
        setError(res.message);
        return;
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">Crear Cuenta</h2>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-control gap-3">
            <div>
              <label className="label">
                <span className="label-text">Nombre Completo</span>
              </label>
              <input name="name" type="text" placeholder="Tu nombre" className="input input-bordered w-full" required />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input name="email" type="email" placeholder="correo@ejemplo.com" className="input input-bordered w-full" required />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input name="password" type="password" placeholder="******" className="input input-bordered w-full" required />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full mt-2 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? "" : "Registrarse"}
            </button>
          </form>

          <div className="divider text-xs uppercase opacity-50">O regístrate con</div>

          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline btn-secondary w-full gap-2"
          >
            <FaGoogle /> Google
          </button>

          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="link link-primary font-semibold">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
