"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import resetPasswordAction from "./action";
import { VerificationProvider, useVerification } from "@/context/VerificationContext";
import z from "zod";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const ForgotPasswordContent = () => {
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

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    const schemaResult = schema.safeParse({ email: formEmail, password });
    if (!schemaResult.success) {
      alert(schemaResult.error.errors[0].message);
      return;
    }

    setFormDataCache({ email: formEmail, password });
    
    // Iniciar verificación -> envía el código al email
    await initiateVerification(formEmail);
  };

  const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    
    if (!code || code.length !== 6) return;
    
    // Verificar código y actualizar password
    const success = await verifyAndRegister(code, resetPasswordAction, formDataCache);
    if (success) {
      router.push("/login?reset=success");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">
            {step === 'form' ? 'Recuperar Cuenta' : 'Verificar Email'}
          </h2>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleRequestSubmit} className="form-control gap-3">
              <p className="text-sm text-center text-gray-500 mb-2">
                Ingresa tu correo y tu nueva contraseña. Te enviaremos un código para confirmar el cambio.
              </p>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input name="email" type="email" placeholder="correo@ejemplo.com" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Nueva Contraseña</span>
                </label>
                <input name="password" type="password" placeholder="******" className="input input-bordered w-full" required />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary mt-2 w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? "" : "Enviar Código"}
              </button>

              <p className="text-center text-sm mt-4">
                ¿Recordaste tu contraseña?{" "}
                <a href="/login" className="link link-primary font-semibold">Inicia sesión</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="form-control gap-4">
              <p className="text-sm text-center text-gray-500 mb-2">
                Enviamos un código de 6 dígitos a <span className="font-bold">{email}</span>.
                Por favor ingrésalo abajo para cambiar tu contraseña.
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
                {loading ? "" : "Confirmar Cambio"}
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

export default function ForgotPasswordPage() {
  return (
    <VerificationProvider>
      <ForgotPasswordContent />
    </VerificationProvider>
  );
}
