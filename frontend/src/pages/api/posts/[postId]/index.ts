import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("*, users (*), comments: posts (*), likes (*)")
      .eq("id", postId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(post);
  }
}
