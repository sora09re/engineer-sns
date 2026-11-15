import { supabase } from "@/shared/api";

/** sign-in のページと sidebar に移すまでの置き場所 */
export const signInWithGitHub = async () => {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: { redirectTo: `${window.location.origin}/auth/callback` },
	});
	if (error) {
		throw error;
	}
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
};
