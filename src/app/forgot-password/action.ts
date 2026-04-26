"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { verifyCode } from "@/app/actions/verificationActions";

export default async function resetPasswordAction(formData: any) {
    try {
        const { email, code, password } = formData;

        if (!email || !code || !password) {
            return { status: false, message: "Todos los campos son obligatorios" };
        }

        // 1. Verificar si el usuario existe
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!existingUser) {
            return { status: false, message: "No se encontró un usuario con ese correo" };
        }

        // 2. Verificar el código
        const verificationResult = await verifyCode(email, code);
        if (!verificationResult.status) {
            return { status: false, message: verificationResult.message };
        }

        // 3. Actualizar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.email, email));

        return { status: true, message: "Contraseña actualizada exitosamente" };
    } catch (error: any) {
        console.error("Error al restablecer contraseña:", error);
        return { status: false, message: "Error interno del servidor" };
    }
}
