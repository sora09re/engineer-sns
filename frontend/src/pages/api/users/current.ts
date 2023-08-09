import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const currentUserId = req.query.currentUserId;

  const { data, error } = await supabase
    .from("users")
    .select("id,name,username,profile_image_url")
    .eq("id", currentUserId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data[0]);
}
