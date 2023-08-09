import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const { data, error } = await supabase.from("users").insert([user]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
