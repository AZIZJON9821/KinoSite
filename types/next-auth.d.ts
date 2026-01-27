import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user: {
            id: string;
            role?: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        token?: string;
        refreshToken?: string;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        role?: string;
        id?: string;
    }
}
