// pages/api/admin-message.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  text?: string;
  targetUserId?: string; // optional: the userId room to send to
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST" });

  const io = (res.socket.server as any)?.io;
  if (!io)
    return res.status(500).json({ error: "Socket.IO server not initialized" });

  const body = req.body as Body;
  const { text, targetUserId } = body;

  if (!text) return res.status(400).json({ error: "Missing text" });

  if (targetUserId) {
    io.to(targetUserId).emit("receive_message", { from: "admin", text });
    return res.status(200).json({ success: true, sentTo: targetUserId, text });
  } else {
    io.emit("receive_message", { from: "admin", text });
    return res.status(200).json({ success: true, broadcast: true, text });
  }
}
