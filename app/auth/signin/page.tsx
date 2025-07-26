import { SigninPageClient } from "@/pages/signin";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export default async function SigninPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return <SigninPageClient />;
}
