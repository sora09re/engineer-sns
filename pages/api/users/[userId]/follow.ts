import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/shared/lib";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (
		req.method !== "GET" &&
		req.method !== "POST" &&
		req.method !== "DELETE"
	) {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const userId = req.query.userId;
	const currentUserId = req.query.currentUserId;

	if (!userId) {
		return res.status(200).json([]);
	}

	try {
		if (req.method === "GET") {
			const { data, error } = await supabase
				.from("follows")
				.select("*")
				.eq("follower_id", userId)
				.eq("following_id", currentUserId)
				.limit(1);

			if (error) {
				throw error;
			}

			return res.status(200).json({ isFollowing: data.length > 0 });
		}

		if (req.method === "POST") {
			const { data, error } = await supabase.from("follows").insert([
				{
					follower_id: userId,
					following_id: currentUserId,
				},
			]);

			if (error) {
				throw error;
			}

			return res.status(200).json(data);
		}

		if (req.method === "DELETE") {
			const { data, error } = await supabase
				.from("follows")
				.delete()
				.eq("follower_id", userId)
				.eq("following_id", currentUserId);

			if (error) {
				throw error;
			}

			return res.status(200).json(data);
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
