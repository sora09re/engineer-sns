import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};
