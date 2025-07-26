import SigninPageClient from "@/app/auth/signin/_components/SigninPageClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SigninPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return <SigninPageClient />;
}
