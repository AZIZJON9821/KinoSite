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
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                        token: account.id_token || account.access_token,
                    });

                    if (response.data) {
                        user.token = response.data.access_token;
                        user.refreshToken = response.data.refresh_token;
                        user.role = response.data.user?.role || 'user';
                        user.id = response.data.user?.id;
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Backend auth failed:", error);
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
