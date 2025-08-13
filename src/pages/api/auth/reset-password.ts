import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId } = req.body;
    return res.status(200).json({ message: `Reset link sent to ${userId}` });
  }
  res.status(405).end();
}