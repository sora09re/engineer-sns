import { supabase } from "@/shared/api";

/** sign-in のページに移すまでの置き場所 */
export const signInWithGitHub = async () => {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: { redirectTo: `${window.location.origin}/auth/callback` },
	});
	if (error) {
		throw error;
	}
};
