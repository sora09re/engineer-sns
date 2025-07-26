import type { NextApiRequest, NextApiResponse } from "next";

import type { PostType } from "@/shared/entities";
import { supabase } from "@/shared/lib";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST" && req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { userId } = req.query;

	try {
		if (req.method === "GET") {
			const { data: posts, error } = await supabase
				.from("posts")
				.select("*, users (*), likes (*), comments: posts (*)")
				.eq("user_id", userId);

			if (posts) {
				posts.sort((a: PostType, b: PostType) => {
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				});
			}

			if (error) {
				throw error;
			}

			return res.status(200).json(posts);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("API Error:", error);
			return res.status(500).json({ error: error.message });
		}

		console.error("An unknown error occurred:", error);
		return res.status(500).json({ error: "An unknown error occurred" });
	}
}
