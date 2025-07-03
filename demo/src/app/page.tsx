"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Board from "~/components/Board";
import MathPreview from "~/components/MathPreview";
import Blur from "~/components/Blur";
import Header from "~/components/Header";

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  function calcMarginHeader(height: number) {
    let spacing = 0.3 * height - 199.1;

    spacing = spacing > 15 ? spacing : 15;

    if (height < 1000) {
      return 0.35 * height + (146 + spacing);
    }

    return 0.4 * height + (146 + spacing);
  }

  function calcMarginBoard(height: number) {
    return 0.5 * height - 146;
  }

  function getResponsiveTextSize(width: number) {
    if (width < 640) return "32px"; // mobile
    if (width < 768) return "36px"; // small tablet
    if (width < 1024) return "42px"; // tablet
    if (width < 1280) return "48px"; // desktop
    return "56px"; // large desktop
  }

  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="relative h-[85vh]">
          <div
            className="absolute left-1/2 z-5 -translate-x-1/2 transition-all duration-600"
            style={{ top: `${calcMarginBoard(windowSize.height)}px` }}
          >
            <Board />
          </div>
          <Blur blur={10} zIndex={4} top={calcMarginBoard(windowSize.height)} />
          <Blur
            blur={100}
            zIndex={3}
            top={calcMarginBoard(windowSize.height)}
          />
          <Blur
            blur={300}
            zIndex={2}
            top={calcMarginBoard(windowSize.height)}
          />
          <Blur
            blur={700}
            zIndex={3}
            top={calcMarginBoard(windowSize.height)}
          />
          <div
            className="absolute z-[0] w-full px-[30px] transition-opacity duration-300"
            style={{
              bottom: `${calcMarginHeader(windowSize.height)}px`,
              opacity: headerVisible ? 1 : 0,
            }}
          >
            <Header windowWidth={windowSize.width} />
          </div>
        </div>
        <MathPreview />
      </div>
    </main>
  );
}
