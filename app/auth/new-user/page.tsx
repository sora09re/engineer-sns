import NewUserPageClient from "@/app/auth/new-user/_components/NewUserPageClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return <NewUserPageClient session={session} />;
}
