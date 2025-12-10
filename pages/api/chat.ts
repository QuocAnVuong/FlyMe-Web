import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
  api: { bodyParser: false },
};

let io: IOServer | null = null;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server...");

    const ioServer = new IOServer(res.socket.server, {
      path: "/api/chat",
      cors: { origin: "*" },
    });

    res.socket.server.io = ioServer;
    io = ioServer;

    io.on("connection", (socket) => {
      const userId = socket.handshake.auth?.userId;
      console.log("🔵 User connected:", socket.id, "userId:", userId);

      if (userId) socket.join(userId);

      // FIX 1: No more duplicate messages — send to OTHERS only
      socket.on("send_message", (payload: { text: string; to?: string }) => {
        const { text, to } = payload;

        console.log("📩 message:", text, "from:", userId, "to:", to);

        if (to) {
          // FIX 2: Targeted message — ONLY to selected user
          io?.to(to).emit("receive_message", { from: userId, text });
        } else {
          // FIX 3: Broadcast to everyone EXCEPT sender
          socket.broadcast.emit("receive_message", {
            from: userId,
            text,
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });
  }

  res.end();
}
