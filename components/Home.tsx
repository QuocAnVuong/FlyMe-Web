"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const images = ["/Home/1.jpg", "/Home/2.jpg", "/Home/3.jpg", "/Home/4.jpg"];
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
    startAutoSlide();
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    startAutoSlide();
  };

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col">
      {/* Slideshow container */}
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="h-full w-full shrink-0 relative flex items-center justify-center"
            >
              {/* Blurred background */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover blur-2xl scale-110"
                />
              </div>

              {/* Foreground image */}
              <Image
                src={src}
                alt={`Slide ${i}`}
                // width={1000}
                // height={600}
                fill
                className="object-contain relative z-10"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full flex justify-center pb-10 z-20">
          <span className="text-blue-300 drop-shadow-[0_0_3px_rgba(0,0,0,0.8)] text-4xl font-semibold">
            Chuyến bay thanh xuân
          </span>
        </div>
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition"
        >
          <span className="text-white text-2xl font-bold select-none">‹</span>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition"
        >
          <span className="text-white text-2xl font-bold select-none">›</span>
        </button>
      </div>
    </div>
  );
}
