import type { Account } from "@/types/account";

import { supabase } from "./client";

/** ログイン中のアカウント。未ログインなら null */
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

/** ログイン中のアカウント ID。未ログインなら例外 */
export const requireAccountId = async (): Promise<string> => {
	const account = await getSignedInAccount();
	if (!account) {
		throw new Error("ログインしていません。");
	}
	return account.id;
};

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

/** 別タブでのログアウトやトークン失効を検知する */
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
