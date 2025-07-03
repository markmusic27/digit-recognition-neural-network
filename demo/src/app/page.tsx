"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Board from "~/components/Board";
import MathPreview from "~/components/MathPreview";
import Blur from "~/components/Blur";
import Header from "~/components/Header";

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boardSize = 292;

  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="relative h-[85vh]">
          <div className="absolute top-1/2 left-1/2 z-4 -translate-x-1/2 -translate-y-1/2">
            <Board />
          </div>
          <Blur blur={50} zIndex={3} opacity={1} />
          <Blur blur={100} zIndex={2} opacity={1} />
          <Blur blur={400} zIndex={1} opacity={1} />
          <Header />
        </div>
        <MathPreview />
      </div>
    </main>
  );
}
