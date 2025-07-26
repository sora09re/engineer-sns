import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/shared/lib";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST" && req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		if (req.method === "GET") {
			const { postId } = req.query;

			if (!postId) {
				return res.status(400).json({ error: "postId is required" });
			}

			const { data: comments, error } = await supabase
				.from("posts")
				.select(
					`
          *,
          users (*),
          likes (*),
          comments: posts (
            *,
            users (*),
            likes (*),
            comments: posts (*)
          )
        `,
				)
				.eq("parent_post_id", postId)
				.order("updated_at", { ascending: false });

			if (error) {
				throw error;
			}

			return res.status(200).json(comments);
		}

		if (req.method === "POST") {
			const { commentContent, currentUserId } = req.body;
			const { postId } = req.query;

			if (!commentContent || !currentUserId || !postId) {
				return res
					.status(400)
					.json({ error: "Content, User ID and Post Id are required" });
			}

			const { data, error } = await supabase.from("posts").insert([
				{
					content: commentContent,
					created_at: new Date(),
					is_deleted: false,
					parent_post_id: postId,
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
