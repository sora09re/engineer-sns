import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const keyword = req.query.keyword;

	if (!keyword) {
		return res.status(200).json([]);
	}

	try {
		const { data: searchPostResults, error } = await supabase
			.from("posts")
			.select("*, users (*), likes (*), comments: posts (*)")
			.is("parent_post_id", null)
			.ilike("content", `%${keyword}%`);

		if (error) {
			throw error;
		}

		return res.status(200).json(searchPostResults);
	} catch (error) {
		if (error instanceof Error) {
			console.error("API Error:", error);
			return res.status(500).json({ error: error.message });
		} else {
			console.error("An unknown error occurred:", error);
			return res.status(500).json({ error: "An unknown error occurred" });
		}
	}
}
