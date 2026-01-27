import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db"; 
import { users, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function refreshAccessToken(token: any) {
    try {
        const url = "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            });

        const response = await fetch(url, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
        });

        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any,
    session: {
        strategy: "jwt", // Obligatorio para usar Credentials
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

                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email),
                }) as any;

                if (!user || !user.password) return null;

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
        async jwt({ token, account, user, trigger }) {
            // Inicio de sesión inicial
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    expiresAt: (account.expires_at ?? 0) * 1000,
                    refreshToken: account.refresh_token,
                    userId: user.id,
                    user: {
                        name: user.name,
                        email: user.email,
                        image: user.image
                    }
                };
            }

            // Si es usuario de Google, verificar si el token expiró
            if (token.refreshToken && Date.now() > (token.expiresAt as number)) {
                return refreshAccessToken(token);
            }

            // Si el usuario se logueó con credenciales, intentamos buscar si tiene una cuenta de Google vinculada
            // para recuperar el accessToken de YouTube de la base de datos
            if (!token.accessToken && token.userId) {
                const [googleAccount] = await db
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(accounts.userId, Number(token.userId)),
                            eq(accounts.provider, "google")
                        )
                    );

                if (googleAccount) {
                    token.accessToken = googleAccount.access_token;
                }
            }

            return token;
        },
        async session({ session, token }) {
            // Pasamos los datos del JWT a la sesión del cliente
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.user.id = token.userId;
            // @ts-ignore
            session.error = token.error;
            
            return session;
        },
    },
    pages: {
        signIn: '/auth/login', 
    },
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
