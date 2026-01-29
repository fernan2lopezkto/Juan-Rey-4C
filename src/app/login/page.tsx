"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa"; // Usando react-icons que tienes en tu package
import z from "zod";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const schemaResult = schema.safeParse({ email, password });
      if (!schemaResult.success) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      const res = await signIn("credentials", {
        email: schemaResult.data.email,
        password: schemaResult.data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales incorrectas");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">Iniciar Sesión</h2>
          
          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-control gap-4">
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                name="email" 
                type="email" 
                placeholder="correo@ejemplo.com" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input 
                name="password" 
                type="password" 
                placeholder="******" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? "" : "Entrar"}
            </button>
          </form>

          <div className="divider text-xs uppercase opacity-50">O continuar con</div>

          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline btn-secondary w-full gap-2"
          >
            <FaGoogle /> Google
          </button>

          <p className="text-center text-sm mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="link link-primary font-semibold">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
