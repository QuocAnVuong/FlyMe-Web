"use client";

import { useEffect } from "react";
import { useSection } from "@/contexts/Section";

export default function Home() {
  const { section, navItems, setSection, pages } = useSection();

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = (e: WheelEvent) => {
      if (isScrolling) return;

      isScrolling = true;
      setTimeout(() => (isScrolling = false), 700);

      if (e.deltaY > 0) {
        setSection((prev) => Math.min(prev + 1, navItems.length - 1));
      } else {
        setSection((prev) => Math.max(prev - 1, 0));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <main className="h-[90vh] w-screen overflow-hidden relative">
      <div
        className="transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(-${section * 90}vh)`,
        }}
      >
        {pages.map((PageComponent, index) => (
          <div key={index} className="h-[90vh] w-screen">
            <PageComponent />
          </div>
        ))}
      </div>
    </main>
  );
}
