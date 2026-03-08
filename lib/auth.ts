import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    console.log("[NextAuth] Attempting login to Render...", account.provider);
                    const response = await axios.post(`https://kino-sayt-backend.onrender.com/auth/google`, {
                        token: account.id_token || account.access_token,
                    });
                    console.log("[NextAuth] Render response status:", response.status);

                    if (response.data) {
                        user.token = response.data.access_token;
                        user.refreshToken = response.data.refresh_token;
                        user.role = response.data.user?.role || 'user';
                        user.id = response.data.user?.id;
                        return true;
                    }
                    console.error("[NextAuth] Authentication rejected. Response data missing or malformed:", response.data);
                    return false;
                } catch (error: any) {
                    console.error("[NextAuth] Backend auth failed FATALLY:", error.message);
                    if (error.response) {
                        console.error("[NextAuth] Error response data:", error.response.data);
                        console.error("[NextAuth] Error response status:", error.response.status);
                    }
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.accessToken = user.token;
                token.refreshToken = user.refreshToken;
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
