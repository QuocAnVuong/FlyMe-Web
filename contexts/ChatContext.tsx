"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type ChatContextType = {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  switchChat: () => void;
  socket: Socket | null;
  userId: string | null;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // create/get a stable userId and store in localStorage
    let stored =
      typeof window !== "undefined"
        ? localStorage.getItem("chat_user_id")
        : null;
    if (!stored && typeof window !== "undefined") {
      stored = `user_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("chat_user_id", stored);
    }
    if (stored) setUserId(stored);

    // initialize socket with auth userId
    const s = io({
      path: "/api/chat",
      auth: { userId: stored ?? undefined },
    });

    s.on("connect", () => {
      console.log("Connected to socket server", s.id, "userId:", stored);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connect error", err);
    });

    // avoid React warning by resolving microtask
    Promise.resolve().then(() => setSocket(s));

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat: () => setIsOpen(true),
        closeChat: () => setIsOpen(false),
        switchChat: () => setIsOpen((prev) => !prev),
        socket,
        userId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
