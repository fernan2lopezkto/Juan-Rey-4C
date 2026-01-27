"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center">Iniciar Sesión</h2>
          
          {/* Botón de Google - Mantiene tu lógica de YouTube */}
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline btn-error w-full gap-2 mt-4"
          >
            <span className="text-lg">G</span> Continuar con Google
          </button>

          <div className="divider">O</div>

          {/* Formulario de Email */}
          <form onSubmit={handleEmailLogin}>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="input input-bordered" 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-control mt-2">
              <label className="label"><span className="label-text">Contraseña</span></label>
              <input 
                type="password" 
                placeholder="********" 
                className="input input-bordered" 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">Entrar</button>
            </div>
          </form>
          
          <p className="text-center text-sm mt-4">
            ¿No tienes cuenta? <a href="/auth/register" className="link link-primary">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}
