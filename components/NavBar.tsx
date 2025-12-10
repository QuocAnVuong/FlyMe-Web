"use client";
import { useSection } from "@/contexts/Section";
import { useChat } from "@/contexts/ChatContext";
import Image from "next/image";

export default function Navbar() {
  const { section, navItems, setSection } = useSection();
  const { openChat } = useChat();

  return (
    // <nav className="h-[10vh] w-full flex items-center justify-center gap-12 text-2xl fixed top-0 z-50">
    <nav className="h-[10vh] w-full flex items-center gap-10 text-l z-50 bg-blue-300">
      <div className="flex items-center justify-center pl-5 rounded-2xl">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
          onClick={() => setSection(0)}
        />
      </div>
      <div className="w-full flex items-center justify-center gap-10">
        {navItems.map((item, index) => (
          <span
            key={item}
            onClick={() => setSection(index)}
            className={`
              cursor-pointer px-3 py-1 rounded-md transition-all duration-300
              ${
                index === section
                  ? "text-blue-900 bg-white"
                  : "text-gray-600 hover:bg-blue-400 hover:text-white"
              }
            `}
          >
            {item}
          </span>
        ))}
      </div>
      <button
        onClick={openChat}
        className="px-4 py-2 rounded-md bg-white text-blue-600 shadow hover:bg-blue-100 transition mr-10"
      >
        Chat
      </button>
    </nav>
  );
}
