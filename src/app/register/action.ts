'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'; // Importamos bcrypt

import { verifyCode } from '@/app/actions/verificationActions';

type TFormData = {
  email: string;
  password: string;
  name: string;
  code: string;
};

const action = async (formData: TFormData) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, formData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { message: 'Email already registered', status: false };
    }

    // 1. Verificar código directamente en el server action para mayor seguridad
    if (!formData.code) {
      return { message: 'Código de verificación requerido', status: false };
    }
    
    const verificationRes = await verifyCode(formData.email, formData.code);
    if (!verificationRes.status) {
      return { message: verificationRes.message, status: false };
    }

    // --- ENCRIPTACIÓN ---
    // El '10' es el nivel de seguridad (salt rounds)
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // 2. Insertar usuario si el código es válido
    await db.insert(users).values({
      name: formData.name,
      email: formData.email,
      password: hashedPassword, // Guardamos la versión segura
      // NOTA: Si decides agregar un emailVerified en el futuro, iría aquí
    });

    return { message: 'User registered successfully', status: true };
  } catch (error) {
    return { message: 'Error en el servidor', status: false };
  }
};

export default action;
