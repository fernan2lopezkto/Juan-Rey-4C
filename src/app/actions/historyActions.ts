'use server'

import { db } from "@/db";
import { youtubeHistory, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getHistoryServer() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const result = await db
    .select()
    .from(youtubeHistory)
    .innerJoin(users, eq(youtubeHistory.userId, users.id))
    .where(eq(users.email, session.user.email))
    .orderBy(desc(youtubeHistory.viewedAt))
    .limit(50);

  return result.map(r => ({
    id: r.youtube_history.videoId,
    title: r.youtube_history.title,
    thumbnail: r.youtube_history.thumbnail,
    channelTitle: r.youtube_history.channelTitle,
  }));
}

export async function addToHistoryServer(video: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email)
  });

  if (user && user.plan === 'pro') {
    await db.insert(youtubeHistory)
      .values({
        userId: user.id,
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        viewedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [youtubeHistory.userId, youtubeHistory.videoId],
        set: { viewedAt: new Date() }
      });
  }
}

export async function deleteFromHistoryServer(videoId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;

    const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
    if (user) {
        await db.delete(youtubeHistory)
            .where(and(eq(youtubeHistory.userId, user.id), eq(youtubeHistory.videoId, videoId)));
    }
}
