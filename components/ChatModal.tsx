"use client";

import { useChat } from "@/contexts/ChatContext";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "server";
  text: string;
};

export default function ChatModal() {
  const { isOpen, closeChat, socket } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // For auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // For dragging
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Auto-scroll when new message arrives
  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (payload: { from: string; text: string }) => {
      const uid = localStorage.getItem("chat_user_id");
      if (payload.from === uid) return;

      setMessages((prev) => [...prev, { role: "server", text: payload.text }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    socket?.emit("send_message", { text: input });

    setInput("");
    setTimeout(scrollToBottom, 50); // ensure smooth scroll after render
  };

  // DRAGGING FUNCTIONS
  const startDrag = (e: React.MouseEvent) => {
    setDragStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!dragStart) return;
    setPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const endDrag = () => {
    setDragStart(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[9999]"
      style={{
        left: pos.x || undefined,
        top: pos.y || undefined,
      }}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
    >
      <div
        className="bg-white w-[380px] h-[480px] rounded-xl shadow-xl flex flex-col"
        style={{ overflow: "hidden" }}
      >
        {/* Header (Draggable) */}
        <div
          className="p-3 border-b flex justify-between items-center bg-blue-500 text-white cursor-move select-none"
          onMouseDown={startDrag}
        >
          <span className="font-semibold">Chat Support</span>
          <button
            onClick={closeChat}
            className="text-white text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-3"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
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
                  className={`px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                  style={{ maxWidth: "65%", width: "fit-content" }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          className="p-3 border-t flex gap-2 bg-gray-50 text-black"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
