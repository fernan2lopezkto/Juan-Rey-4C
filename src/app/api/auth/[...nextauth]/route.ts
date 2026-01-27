import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db"; 
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
    // Usamos el adaptador para que NextAuth gestione las tablas automáticamente
    adapter: DrizzleAdapter(db) as any,
    session: {
        strategy: "jwt", // Requerido para Credentials
    },
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
        CredentialsProvider({
            name: "Email y Contraseña",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Buscamos al usuario en la base de datos
                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email),
                }) as any;

                // Si no existe o no tiene password (login con Google), denegamos
                if (!user || !user.password) return null;

                // Verificamos la contraseña
                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) return null;

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // Logueo inicial (Google o Credenciales)
            if (account && user) {
                const expiresAt = account.expires_at
                    ? account.expires_at * 1000
                    : Date.now() + 3600 * 1000;

                return {
                    ...token,
                    accessToken: account.access_token,
                    expiresAt: expiresAt,
                    refreshToken: account.refresh_token,
                    userId: user.id
                };
            }

            // Si es un usuario de credenciales o el token no ha expirado
            if (!token.refreshToken || Date.now() < (token.expiresAt as number)) {
                return token;
            }

            // Si es usuario de Google y el token expiró, refrescamos
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.error = token.error;
            // @ts-ignore
            session.user.id = token.userId;
            return session;
        },
    },
    // Opcional: define páginas personalizadas si no quieres las de NextAuth
    pages: {
        signIn: '/auth/login', 
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
