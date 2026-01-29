"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import z from "zod";

const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

      // 1. Validar con Zod antes de enviar
      const schemaResult = schema.safeParse({ email, password });
      if (!schemaResult.success) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      // 2. Ejecutar el login con NextAuth
      // Usamos redirect: false para manejar nosotros el error o el éxito
      const res = await signIn("credentials", {
        email: schemaResult.data.email,
        password: schemaResult.data.password,
        redirect: false,
      });

      if (res?.error) {
        // NextAuth devuelve errores comunes como "CredentialsSignin"
        setError("Invalid email or password");
      } else {
        // 3. Si todo sale bien, redirigir al home y refrescar estado
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 w-full max-w-sm p-6 border rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="border p-2 rounded text-black"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="border p-2 rounded text-black"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded font-semibold disabled:bg-blue-300"
        >
          {loading ? "Cargando..." : "Login"}
        </button>

        <p className="text-sm text-center">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 underline">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
