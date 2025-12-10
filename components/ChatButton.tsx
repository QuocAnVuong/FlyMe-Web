"use client";

import { useChat } from "@/contexts/ChatContext";

export default function ChatButton() {
  const { switchChat } = useChat();

  return (
    <button
      onClick={switchChat}
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition z-[9999]"
    >
      💬
    </button>
  );
}
