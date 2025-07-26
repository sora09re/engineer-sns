import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const getCurrentUserId = async (): Promise<string> => {
	const session = await auth();

	const currentUserId: string | undefined = session?.user.id;

	if (!currentUserId) {
		redirect("/auth/signin");
	}

	return currentUserId;
};
