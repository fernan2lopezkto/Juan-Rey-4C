'use server';

import { db } from "@/db";
import { songs, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Song } from "@/types/notebook";

/**
 * Obtiene todas las canciones del usuario desde la nube
 */
export async function getSongsServer() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const result = await db
    .select()
    .from(songs)
    .innerJoin(users, eq(songs.userId, users.id))
    .where(eq(users.email, session.user.email))
    .orderBy(desc(songs.updatedAt));

  return result.map(r => ({
    id: r.songs.id,
    title: r.songs.title,
    chords: r.songs.chords || '',
    notes: r.songs.notes || '',
    tags: (r.songs.tags as string[]) || [],
    date: r.songs.updatedAt ? new Date(r.songs.updatedAt).toLocaleDateString() : ''
  })) as Song[];
}

/**
 * Crea o actualiza una canción (Upsert)
 */
export async function syncSongServer(song: Song) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email)
  });

  if (!user || user.plan !== 'pro') {
    return { error: "Se requiere plan Pro para sincronizar en la nube" };
  }

  try {
    await db.insert(songs)
      .values({
        id: song.id,
        userId: user.id,
        title: song.title,
        chords: song.chords,
        notes: song.notes,
        tags: song.tags,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: songs.id,
        set: {
          title: song.title,
          chords: song.chords,
          notes: song.notes,
          tags: song.tags,
          updatedAt: new Date(),
        }
      });
    
    return { success: true };
  } catch (error) {
    console.error("Error en syncSongServer:", error);
    return { error: "Error al guardar en la base de datos" };
  }
}

/**
 * Elimina una canción de la nube
 */
export async function deleteSongServer(songId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email)
  });

  if (user && user.plan === 'pro') {
    await db.delete(songs)
      .where(and(
        eq(songs.id, songId),
        eq(songs.userId, user.id)
      ));
  }
}
