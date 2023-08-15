import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "DELETE"
  ) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    const { currentUserId, postId } = req.query;

    if (!postId || !currentUserId) {
      return res
        .status(400)
        .json({ error: "postId or currentUserId is required" });
    }

    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", currentUserId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const { postId } = req.query;
    const { currentUserId } = req.body;

    if (!postId || !currentUserId) {
      return res
        .status(400)
        .json({ error: "postId or currentUserId is required" });
    }

    const { data, error } = await supabase.from("likes").insert([
      {
        post_id: postId,
        user_id: currentUserId,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === "DELETE") {
    const { currentUserId, postId } = req.query;

    if (!postId || !currentUserId) {
      return res
        .status(400)
        .json({ error: "postId or currentUserId is required" });
    }

    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", currentUserId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }
}
