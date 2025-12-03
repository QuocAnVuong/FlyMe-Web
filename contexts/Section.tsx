"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import HomePage from "@/components/Home";
import DemoPage from "@/components/Demo";
import NewsPage from "@/components/News";
import AboutPage from "@/components/About";

type SectionContextType = {
  section: number;
  setSection: Dispatch<SetStateAction<number>>;
  navItems: string[];
  pages: React.ComponentType[]; // <── NEW
};

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const navItems = ["Trang chủ", "Giới thiệu", "Concept", "About"];

  // The components match the exact order of navItems
  const pages = [HomePage, DemoPage, NewsPage, AboutPage];

  const [section, setSection] = useState(0);

  return (
    <SectionContext.Provider value={{ section, setSection, navItems, pages }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (!context)
    throw new Error("useSection must be used within SectionProvider");
  return context;
}
