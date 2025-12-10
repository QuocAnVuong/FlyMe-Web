import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure socket exists
  const serverSocket = res.socket?.server;

  if (!serverSocket) {
    return res.status(500).json({ error: "Socket server not available" });
  }

  // Ensure IO exists
  const io = (serverSocket as any).io;

  if (!io) {
    return res.status(500).json({ error: "Socket.IO server not initialized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text, targetUserId } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text'" });
  }

  // Send to a specific user
  if (targetUserId) {
    io.to(targetUserId).emit("receive_message", { from: "admin", text });
    return res.status(200).json({ success: true, sentTo: targetUserId });
  }

  // Broadcast to all if no targetUserId
  io.emit("receive_message", { from: "admin", text });

  return res.status(200).json({ success: true, broadcast: true });
}
