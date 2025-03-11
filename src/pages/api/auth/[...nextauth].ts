import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

if (
	!process.env.SUPABASE_SERVICE_ROLE_KEY ||
	!process.env.NEXT_PUBLIC_SUPABASE_URL ||
	!process.env.GITHUB_ID ||
	!process.env.GITHUB_SECRET
) {
	throw new Error("Environment variables are not set");
}

export const authOptions: NextAuthOptions = {
	adapter: SupabaseAdapter({
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
		url: process.env.NEXT_PUBLIC_SUPABASE_URL,
	}),
	callbacks: {
		async session({ session, user }) {
			if (user) {
				session.user.id = user.id as string;
			}

			return session;
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
	theme: {
		colorScheme: "light",
	},
};

export default NextAuth(authOptions);
