import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as NetServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

//
// Extend Next.js res.socket.server to include `.io`
//
interface SocketServer extends NetServer {
  io?: IOServer;
}

interface SocketWithServer extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithServer;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const httpServer = res.socket?.server;

  if (!httpServer) {
    return res.status(500).json({ error: "Socket server not available" });
  }

  const io = httpServer.io;

  if (!io) {
    return res
      .status(500)
      .json({ error: "Socket.IO server is not initialized yet" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { text, targetUserId } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid 'text' field" });
  }

  if (targetUserId) {
    io.to(targetUserId).emit("receive_message", { from: "admin", text });
    return res.status(200).json({ success: true, sentTo: targetUserId });
  }

  io.emit("receive_message", { from: "admin", text });

  return res.status(200).json({ success: true, broadcast: true });
}
