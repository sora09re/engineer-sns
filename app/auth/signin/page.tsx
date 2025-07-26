import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SigninPageClient from "./_components/SigninPageClient";

export default async function SigninPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return <SigninPageClient />;
}
