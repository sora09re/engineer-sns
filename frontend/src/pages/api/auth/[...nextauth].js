import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const options = {
  adapter: SupabaseAdapter({
    schema: "next_auth",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }),
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

export default NextAuth(options);
