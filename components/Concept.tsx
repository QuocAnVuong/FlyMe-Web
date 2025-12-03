"use client";

import { useState } from "react";
import Image from "next/image";
import conceptsData from "@/data/concepts.json";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 6;

export default function ConceptPage() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(0);

  const totalPages = Math.ceil(conceptsData.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleItems = conceptsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (page < totalPages) {
      setDirection(1); // slide left
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setDirection(-1); // slide right
      setPage(page - 1);
    }
  };

  return (
    <div className="h-full w-full bg-blue-300 flex flex-col items-center justify-center py-10">
      {/* Container 1 */}
      <div className="relative w-[80%] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? 100 : -100 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="grid grid-cols-3 gap-6 w-full h-full"
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer group relative w-full aspect-video rounded-lg overflow-hidden shadow-md"
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {/* Blue overlay */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors duration-500 ease-out" />

                {/* Bottom overlay */}
                <div className="absolute bottom-0 w-full bg-black/50 text-white px-4 py-2 ">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <div className="pt-2 flex items-center grow justify-center gap-6 text-xl font-semibold">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-5 py-2 rounded-lg bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white shadow-sm disabled:opacity-30 transition"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-5 py-2 rounded-lg bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white shadow-sm disabled:opacity-30 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
