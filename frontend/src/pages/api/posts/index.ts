import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (req.method === "GET") {
    const { data: follows, error: errorFollows } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userId);

    if (errorFollows) {
      return res.status(500).json({ error: errorFollows.message });
    }

    const followerIds = follows.map((follow) => {
      return follow.follower_id;
    });

    const { data: posts, error: errorPosts } = await supabase
      .from("posts")
      .select("*, users (*), comments (*), likes (*)")
      .in("user_id", followerIds);

    if (errorPosts) {
      return res.status(500).json({ error: errorPosts.message });
    }

    return res.status(200).json(posts);
  }
}
