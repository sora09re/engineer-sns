import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { apiUrl } from "@/utils/baseUrl";

if (
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.GITHUB_ID ||
  !process.env.GITHUB_SECRET
) {
  throw new Error("Environment variables are not set");
}
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ account, token, user }) {
      if (user) {
        const currentUser = await axios.get(
          `${apiUrl}/auth/current?email=${user.email}`
        );

        if (currentUser && account) {
          token.id = currentUser.data.id;
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken as string;

      return session;
    },
    async signIn({ account, user }) {
      if (!account) {
        return false;
      }

      const data = {
        email: user.email,
        githubId: account.providerAccountId,
        name: user.name,
      };

      const response = await axios.post(`${apiUrl}/auth/github`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        return true;
      }

      return false;
    },
  },
  pages: {
    newUser: "/auth/new-user",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET,
  theme: {
    colorScheme: "light",
  },
};

export default NextAuth(authOptions);
