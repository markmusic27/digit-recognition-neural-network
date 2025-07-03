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

  function calcMarginHeader(height: number) {
    let spacing = 0.3 * height - 199.1;

    spacing = spacing > 15 ? spacing : 15;

    console.log();

    return 0.425 * height + (146 + spacing);
  }

  function calcMarginBoard(height: number) {
    return 0.5 * height - 146;
  }

  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="relative h-[85vh]">
          <div
            className="absolute left-1/2 z-5 -translate-x-1/2"
            style={{ top: `${calcMarginBoard(windowSize.height)}px` }}
          >
            <Board />
          </div>
          <Blur
            blur={50}
            zIndex={4}
            opacity={1}
            top={calcMarginBoard(windowSize.height)}
          />
          <Blur
            blur={100}
            zIndex={3}
            opacity={1}
            top={calcMarginBoard(windowSize.height)}
          />
          <Blur
            blur={400}
            zIndex={2}
            opacity={1}
            top={calcMarginBoard(windowSize.height)}
          />
          <div
            className="absolute left-1/2 z-[0] -translate-x-1/2"
            style={{ bottom: `${calcMarginHeader(windowSize.height)}px` }}
          >
            <Header />
          </div>
        </div>
        <MathPreview />
      </div>
    </main>
  );
}
