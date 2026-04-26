'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ADMIN_EMAILS } from "@/utils/admin";

export async function updateUserPlan(userId: number, newPlan: string) {
  const session = await getServerSession(authOptions);
  
  // ⚠️ Autorización basada en la lista de administradores
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error("No autorizado");
  }

  await db.update(users)
    .set({ plan: newPlan })
    .where(eq(users.id, userId));

  revalidatePath("/ulist");
}

export async function getLiveUserPlan(email: string) {
    if (!email) return 'basic';
    const [user] = await db.select({ plan: users.plan }).from(users).where(eq(users.email, email)).limit(1);
    return user?.plan || 'basic';
}

export async function deleteAccountByAdmin(userId: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error("No autorizado");
  }

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/ulist");
  return { success: true };
}
