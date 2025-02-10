import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { LOGIN } from "./lib/routes";

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
    ],
    pages: {
        signIn: LOGIN,
    },
    callbacks: {
        async session({ session }) {
            if (session.user) {
                session.user.role = "user";
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", user, account, profile, email, credentials)

            return true

        },
    },
    trustHost: true,
});
