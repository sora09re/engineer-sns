import { createFileRoute } from "@tanstack/react-router";

import { Search } from "@/components/Search/Search";
import { pageTitle } from "@/lib/title";

export const Route = createFileRoute("/_authed/search")({
	head: () => pageTitle("検索"),
	component: Search,
});
