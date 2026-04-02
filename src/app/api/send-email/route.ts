import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendMail } from "@/lib/mailer";

const ADMIN_EMAIL = "fernan2lopezkto@gmail.com";

export async function POST(req: NextRequest) {
  // Solo el admin puede enviar correos
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { to, subject, message } = await req.json();

  if (!to || !subject || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    await sendMail({
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #6d28d9; margin-bottom: 16px;">Mensaje de Juan Rey 4C</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="white-space: pre-wrap; color: #374151; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; text-align: center;">
            Enviado desde el Panel Admin de Juan Rey 4C
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
  }
}
