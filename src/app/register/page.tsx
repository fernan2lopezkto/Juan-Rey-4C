'use client';

import { useState } from 'react';
import action from './action';
import z from 'zod';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

const RegisterPage = () => {
  const { push } = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

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

      // Registro exitoso -> Al login
      push('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm p-6 border rounded-lg shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>
        
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}

        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" type="text" className="border p-2 rounded" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="border p-2 rounded" required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="border p-2 rounded" required />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white py-2 rounded font-bold disabled:bg-gray-400"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
