import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db"; 
import { users, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Función para refrescar el token si caducó
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

        console.log("Token refrescado con éxito");

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
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true, // IMPORTANTE: Permite unir cuentas por email
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

                // Buscamos usuario
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
            // 1. PRIMER LOGIN (Google o Credenciales)
            if (account && user) {
                console.log("Inicio de sesión detectado. Provider:", account.provider);
                return {
                    ...token,
                    accessToken: account.access_token,
                    expiresAt: (account.expires_at ?? 0) * 1000,
                    refreshToken: account.refresh_token,
                    userId: user.id, // Guardamos el ID para usarlo después
                };
            }

            // 2. TOKEN EXISTENTE: Verificar si expiró (Solo si es token de Google)
            if (token.accessToken && token.refreshToken) {
                if (Date.now() > (token.expiresAt as number)) {
                    console.log("El token expiró, refrescando...");
                    return refreshAccessToken(token);
                }
            }

            // 3. RECUPERACIÓN DE TOKEN (El paso crítico)
            // Si no tenemos accessToken en el JWT (login con credenciales), lo buscamos en la DB
            if (!token.accessToken && token.sub) {
                try {
                    // Convertimos token.sub (string) a Number porque tu DB usa IDs numéricos
                    const userIdNum = parseInt(token.sub); 
                    
                    if (!isNaN(userIdNum)) {
                        const [googleAccount] = await db
                            .select()
                            .from(accounts)
                            .where(
                                and(
                                    eq(accounts.userId, userIdNum),
                                    eq(accounts.provider, "google")
                                )
                            );

                        if (googleAccount && googleAccount.access_token) {
                            console.log("Token de Google recuperado de la DB para usuario:", userIdNum);
                            token.accessToken = googleAccount.access_token;
                            token.refreshToken = googleAccount.refresh_token;
                            token.expiresAt = (googleAccount.expires_at ?? 0) * 1000;
                        } else {
                            // console.log("No se encontró cuenta de Google vinculada para usuario:", userIdNum);
                        }
                    }
                } catch (e) {
                    console.error("Error recuperando token de DB:", e);
                }
            }

            return token;
        },
        async session({ session, token }) {
            // Pasar datos del JWT a la sesión del cliente
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub ?? token.userId;
            }
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.error = token.error;
            
            return session;
        },
    },
    pages: {
        signIn: '/auth/login', 
    },
    debug: true, // Activa logs detallados en Vercel
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
