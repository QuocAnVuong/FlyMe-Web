"use client";

import { useChat } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";

type ChatMessage = {
  role: "user" | "server";
  text: string;
};

export default function ChatModal() {
  const { isOpen, closeChat, socket } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    // server now emits object { from, text }
    socket.on("receive_message", (payload: { from: string; text: string }) => {
      const isFromMe = payload.from === localStorage.getItem("chat_user_id");
      // If from me, skip adding because we already add local user messages when sending
      if (isFromMe) return;

      setMessages((prev) => [...prev, { role: "server", text: payload.text }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim()) return;
    // locally show user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    // send structured payload to server (server will broadcast to others)
    const payload = { text: input };
    socket?.emit("send_message", payload);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] text-black">
      <div className="bg-white w-[400px] h-[500px] rounded-lg shadow-lg flex flex-col">
        <div className="p-4 border-b flex justify-between">
          <h2 className="font-bold text-lg">Chat Support</h2>
          <button onClick={closeChat}>✖</button>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={i}
                className={`flex w-full ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm break-words
                    ${
                      isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }
                  `}
                  style={{
                    maxWidth: "50%",
                    width: "fit-content",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-black"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
