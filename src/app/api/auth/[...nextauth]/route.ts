import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db"; // Asegúrate que esta ruta sea correcta según tu Spck
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function refreshAccessToken(token: any) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            });

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.log("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/youtube.force-ssl",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;
            try {
                // Verificar si el usuario ya existe en Postgres (Neon)
                const existingUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, user.email))
                    .limit(1);

                if (existingUser.length === 0) {
                    // Si es nuevo, lo guardamos
                    await db.insert(users).values({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }
                return true;
            } catch (error) {
                console.error("Error saving user to DB:", error);
                return true; // Permitimos el login aunque falle el guardado para no bloquear al usuario
            }
        },
        async jwt({ token, account, user }) {
            if (account && user) {
                const expiresAt = account.expires_at
                    ? account.expires_at * 1000
                    : Date.now() + 3600 * 1000;

                return {
                    ...token,
                    accessToken: account.access_token,
                    expiresAt: expiresAt,
                    refreshToken: account.refresh_token,
                };
            }

            // @ts-ignore
            if (Date.now() < (token.expiresAt as number)) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.error = token.error;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
