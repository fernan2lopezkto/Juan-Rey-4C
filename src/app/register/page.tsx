"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import registerAction from "./action";
import { VerificationProvider, useVerification } from "@/context/VerificationContext";
import z from "zod";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(3, "Mínimo 3 caracteres"),
});

const RegisterContent = () => {
  const router = useRouter();
  const [formDataCache, setFormDataCache] = useState<any>(null);
  
  const {
    step,
    email,
    loading,
    error,
    initiateVerification,
    verifyAndRegister,
    resendCode,
    clearError
  } = useVerification();

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const schemaResult = schema.safeParse({ email: formEmail, password, name });
    if (!schemaResult.success) {
      alert(schemaResult.error.errors[0].message);
      return;
    }

    setFormDataCache({ email: formEmail, password, name });
    
    // Iniciar verificación -> envía el código al email
    await initiateVerification(formEmail);
  };

  const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    
    if (!code || code.length !== 6) return;
    
    // Verificar código y si es válido, llamar a registerAction
    const success = await verifyAndRegister(code, registerAction, formDataCache);
    if (success) {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">
            {step === 'form' ? 'Crear Cuenta' : 'Verificar Email'}
          </h2>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleRegisterSubmit} className="form-control gap-3">
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
                className={`btn btn-primary mt-2 w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? "" : "Registrarse"}
              </button>

              <div className="divider text-xs uppercase opacity-50">O regístrate con</div>

              <button 
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="btn btn-outline btn-secondary w-full gap-2"
              >
                <FaGoogle /> Google
              </button>

              <p className="text-center text-sm mt-4">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="link link-primary font-semibold">Inicia sesión</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="form-control gap-4">
              <p className="text-sm text-center text-gray-500 mb-2">
                Enviamos un código de 6 dígitos a <span className="font-bold">{email}</span>.
                Por favor ingrésalo abajo para completar tu registro.
              </p>

              <div>
                <input 
                  name="code" 
                  type="text" 
                  pattern="[0-9]{6}" 
                  maxLength={6}
                  placeholder="------" 
                  className="input input-bordered w-full text-center text-2xl tracking-[0.5em] font-mono" 
                  required 
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? "" : "Verificar Código"}
              </button>
              
              <button
                type="button"
                onClick={() => resendCode()}
                className="btn btn-ghost btn-sm w-full mt-2"
                disabled={loading}
              >
                Reenviar código
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  return (
    <VerificationProvider>
      <RegisterContent />
    </VerificationProvider>
  );
};

export default RegisterPage;
