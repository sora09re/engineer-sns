import { NewUserPageClient } from "@/pages/new-user";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return <NewUserPageClient session={session} />;
}
