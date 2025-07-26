import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import type { User } from "@/shared/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetCurrentUser = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const currentUserId = session?.user.id;
	const { data, error, isLoading, mutate } = useSWR<User>(
		currentUserId
			? `${baseURL}/api/users/current?currentUserId=${currentUserId}`
			: null,
		fetcher,
	);

	if (
		typeof window !== "undefined" &&
		status === "unauthenticated" &&
		!session
	) {
		router.push("/auth/signin");
	}

	if (status === "authenticated" && !isLoading && !data) {
		router.push("/auth/new-user");
	}

	if (!data) {
		return { loading: true };
	}

	return {
		data,
		error,
		isLoading,
		mutate,
	};
};
