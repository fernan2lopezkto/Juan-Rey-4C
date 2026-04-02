'use server';

import { db } from '@/db';
import { emailVerifications } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { sendMail } from '@/lib/mailer';

// Generar código de 6 dígitos
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function sendVerificationCode(email: string) {
  try {
    const code = generateCode();
    // Vence en 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar en la DB
    await db.insert(emailVerifications).values({
      email,
      code,
      expiresAt,
    });

    // Enviar por email
    await sendMail({
      to: email,
      subject: "Código de Verificación - Juan Rey 4C",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #6d28d9; margin-bottom: 16px;">Verifica tu Email</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #374151; font-size: 16px;">Tu código de verificación es:</p>
            <h1 style="color: #6d28d9; font-size: 32px; letter-spacing: 4px; margin: 16px 0;">${code}</h1>
            <p style="color: #6b7280; font-size: 14px;">Este código expirará en 15 minutos.</p>
          </div>
        </div>
      `,
    });

    return { status: true, message: "Código enviado" };
  } catch (error) {
    console.error("Error enviando código:", error);
    return { status: false, message: "Error al enviar el código de verificación" };
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    // Buscar código válido, no usado y no expirado
    const verification = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, code),
          eq(emailVerifications.used, false),
          gt(emailVerifications.expiresAt, new Date())
        )
      )
      .limit(1);

    if (verification.length === 0) {
      return { status: false, message: "Código de verificación inválido o expirado" };
    }

    // Marcar como usado
    await db.update(emailVerifications)
      .set({ used: true })
      .where(eq(emailVerifications.id, verification[0].id));

    return { status: true, message: "Email verificado correctamente" };
  } catch (error) {
    console.error("Error verificando código:", error);
    return { status: false, message: "Error al verificar el código" };
  }
}
