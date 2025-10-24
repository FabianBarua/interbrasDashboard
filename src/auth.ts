import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db/config";
import { Users, Accounts, Sessions, VerificationTokens } from "../db/schema";

import { LOGIN } from "./lib/routes";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: Users,
        accountsTable: Accounts,
        sessionsTable: Sessions,
        verificationTokensTable: VerificationTokens,
    }),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    pages: {
        signIn: LOGIN,
    },
    callbacks: {
        async session({ session, user }) {
            // Agregar el rol del usuario desde la BD a la sesión
            if (session.user) {
                session.user.id = user.id;
                session.user.role = (user as any).role || "user";
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // El adaptador maneja automáticamente la creación de usuarios
            console.log("Usuario autenticado:", user.email);
            return true;
        },
    },
    session: {
        strategy: "database", // Usar sesiones en base de datos
    },
    trustHost: true,
});
