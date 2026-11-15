import { supabase } from "@/shared/api";

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
};
