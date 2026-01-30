'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'; // Importamos bcrypt

type TFormData = {
  email: string;
  password: string;
  name: string;
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

    // --- ENCRIPTACIÓN ---
    // El '10' es el nivel de seguridad (salt rounds)
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    await db.insert(users).values({
      ...formData,
      password: hashedPassword, // Guardamos la versión segura
    });

    return { message: 'User registered successfully', status: true };
  } catch (error) {
    return { message: 'Error en el servidor', status: false };
  }
};

export default action;
