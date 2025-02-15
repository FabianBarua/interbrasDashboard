import { LOGIN } from "./lib/routes";
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { Accounts, db, Sessions, Users, VerificationTokens } from "@root/db/config";
import { Role } from "./next-auth";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
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
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: LOGIN,
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as Role;
            session.user.image = session.user.image || `https://api.dicebear.com/9.x/thumbs/png?seed=${session.user.name || "user"}`;
            return session
        },
        jwt({ token, user }) {
            if(user) token.role = user.role
            return token
        },
    },
    trustHost: true,
    adapter : DrizzleAdapter(db, {
        usersTable: Users,
        accountsTable: Accounts,
        sessionsTable: Sessions,
        verificationTokensTable: VerificationTokens,
      }) as Adapter,
});
