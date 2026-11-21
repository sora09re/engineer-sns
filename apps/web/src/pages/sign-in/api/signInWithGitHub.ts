import { supabase } from "@/shared/api";

export const signInWithGitHub = async () => {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: { redirectTo: `${window.location.origin}/auth/callback` },
	});
	if (error) {
		throw error;
	}
};
