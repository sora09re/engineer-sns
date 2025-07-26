import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import NewUserPageClient from "./_components/NewUserPageClient";

export default async function NewUserPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return <NewUserPageClient session={session} />;
}
