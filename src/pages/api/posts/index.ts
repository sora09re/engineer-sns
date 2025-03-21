import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST" && req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		if (req.method === "GET") {
			const { currentUserId } = req.query;

			if (!currentUserId) {
				return res.status(400).json({ error: "currentUserId is required" });
			}

			const { data: follows, error: errorFollows } = await supabase
				.from("follows")
				.select("follower_id")
				.eq("following_id", currentUserId);

			if (errorFollows) {
				throw errorFollows;
			}

			const followerIds = follows.map((follow) => {
				return follow.follower_id;
			});

			const { data: posts, error: errorPosts } = await supabase
				.from("posts")
				.select("*, users (*), likes (*), comments: posts (*)")
				.is("parent_post_id", null)
				.in("user_id", [...followerIds, currentUserId])
				.order("updated_at", { ascending: false });

			if (errorPosts) {
				throw errorPosts;
			}

			return res.status(200).json(posts);
		}

		if (req.method === "POST") {
			const { currentUserId, postContent } = req.body;

			if (!postContent || !currentUserId) {
				return res
					.status(400)
					.json({ error: "Content and User ID are required" });
			}

			const { data, error } = await supabase.from("posts").insert([
				{
					content: postContent,
					created_at: new Date(),
					is_deleted: false,
					parent_post_id: null,
					updated_at: new Date(),
					user_id: currentUserId,
				},
			]);

			if (error) {
				throw error;
			}

			return res.status(200).json({ data });
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("API Error:", error);
			return res.status(500).json({ error: error.message });
		}

		console.error("An unknown error occurred:", error);
		return res.status(500).json({ error: "An unknown error occurred" });
	}
}
