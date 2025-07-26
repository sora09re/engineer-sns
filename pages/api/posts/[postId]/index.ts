import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/shared/utils/supabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "GET" && req.method !== "DELETE") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { postId } = req.query;

	if (!postId) {
		return res.status(400).json({ error: "postId is required" });
	}

	try {
		if (req.method === "GET") {
			const { data: post, error } = await supabase
				.from("posts")
				.select("*, users (*), comments: posts (*), likes (*)")
				.eq("id", postId)
				.single();

			if (error) {
				throw error;
			}

			return res.status(200).json(post);
		}

		if (req.method === "DELETE") {
			const { data: post, error } = await supabase
				.from("posts")
				.delete()
				.eq("id", postId);

			if (error) {
				throw error;
			}

			return res.status(200).json(post);
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
