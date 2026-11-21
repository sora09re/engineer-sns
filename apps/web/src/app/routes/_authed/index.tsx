import { createFileRoute } from "@tanstack/react-router";

import { timelinePostsQuery } from "@/entities/post";
import { TimelinePage } from "@/pages/timeline";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/")({
	head: () => pageTitle("ホーム"),
	loader: ({ context }) => context.queryClient.ensureQueryData(timelinePostsQuery()),
	component: TimelinePage,
});
