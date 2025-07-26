import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const userId = req.query.userId;

	if (!userId) {
		return res.status(200).json([]);
	}

	try {
		if (req.method === "GET") {
			const { data, error } = await supabase
				.from("follows")
				.select("*, users:following_id (*)")
				.eq("follower_id", userId);

			const followers = data?.map((follower) => {
				return follower.users;
			});

			if (error) {
				throw error;
			}

			return res.status(200).json(followers);
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
