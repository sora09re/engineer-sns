import type { Account } from "@engineer-sns/shared";

import { supabase } from "@/shared/api";

export const getSignedInAccount = async (): Promise<Account | null> => {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return null;
	}

	const { user } = session;
	const metadata = user.user_metadata as Record<string, string | undefined>;

	return {
		id: user.id,
		avatarUrl: metadata.avatar_url,
		email: user.email,
		name: metadata.full_name ?? metadata.name ?? metadata.user_name,
	};
};

export const onSignedOut = (callback: () => void) => {
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange((event) => {
		if (event === "SIGNED_OUT") {
			callback();
		}
	});
	return () => {
		subscription.unsubscribe();
	};
};
