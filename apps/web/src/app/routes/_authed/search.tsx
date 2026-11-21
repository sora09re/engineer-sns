import { createFileRoute } from "@tanstack/react-router";

import { SearchPage } from "@/pages/search";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/search")({
	head: () => pageTitle("検索"),
	component: SearchPage,
});
