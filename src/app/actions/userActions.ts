"use server";
import { db } from "@/db"; // Tu instancia de Drizzle
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function getUserPlan() {
  const session = await getServerSession();
  if (!session?.user?.email) return 'free';

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  return user?.plan || 'free';
}

export async function changeUserPlan(newPlan: string) {
  const session = await getServerSession();
  if (!session?.user?.email) return { success: false, error: 'Not authenticated' };

  try {
    await db.update(users)
      .set({ plan: newPlan })
      .where(eq(users.email, session.user.email));
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false, error: 'Failed to update plan' };
  }
}
