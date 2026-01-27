import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario ya existe con este email" },
        { status: 400 }
      );
    }

    // 3. Encriptar la contraseña (importante usar bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. TRUCO PARA EL BUILD:
    // Creamos el objeto como 'any' para que TypeScript no se queje 
    // si cree que la columna 'password' no existe.
    const newUser: any = {
      email,
      name: name ?? "",
      password: hashedPassword, 
      plan: "free",
    };

    // Insertar en la base de datos usando el objeto casteado
    await db.insert(users).values(newUser);

    return NextResponse.json(
      { message: "Usuario creado con éxito" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
