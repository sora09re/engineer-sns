import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId } = req.query;

    if (req.method === "GET") {
      const { data: user, error } = await supabase
        .from("users")
        .select(
          "*, follower_user_id:follows!follower_id (*), following_user_id:follows!following_id (*)"
        )
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      return res.status(200).json(user);
    }

    if (req.method === "POST") {
      const { values } = req.body;
      const { data, error } = await supabase
        .from("users")
        .update([
          {
            ...values,
            updated_at: new Date(),
          },
        ])
        .eq("id", userId);

      if (error) {
        throw error;
      }

      return res.status(200).json(data);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("An unknown error occurred:", error);
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
