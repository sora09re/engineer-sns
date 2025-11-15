import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions: NextAuthConfig = {
	adapter: SupabaseAdapter({
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
		url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
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
	providers: [GitHub],
	theme: {
		colorScheme: "light",
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
