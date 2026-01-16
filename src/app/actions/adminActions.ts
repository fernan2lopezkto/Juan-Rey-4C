'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateUserPlan(userId: number, currentPlan: string) {
  const session = await getServerSession(authOptions);
  
  // ⚠️ IMPORTANTE: Pon aquí tu correo real de Google
  if (session?.user?.email !== "fernan2lopezkto@gmail.com") {
    throw new Error("No autorizado");
  }

  const newPlan = currentPlan === 'pro' ? 'free' : 'pro';

  await db.update(users)
    .set({ plan: newPlan })
    .where(eq(users.id, userId));

  revalidatePath("/ulist");
}
