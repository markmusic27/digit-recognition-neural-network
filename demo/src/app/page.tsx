"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Board from "~/components/Board";
import type { BoardHandle } from "~/components/Board";
import MathPreview from "~/components/MathPreview";
import Blur from "~/components/Blur";
import Header from "~/components/Header";
import CustomButton from "~/components/CustomButton";

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [headerVisible, setHeaderVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [boardIsClear, setBoardIsClear] = useState(true);
  const boardRef = useRef<BoardHandle>(null);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 200);

    const buttonTimer = setTimeout(() => {
      setButtonVisible(true);
    }, 650);

    setTimeout(() => {
      window.scrollBy(0, 1);
    }, 5);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(buttonTimer);
    };
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

  // Handler for board changes
  const handleBoardDraw = (pixels: number[][]) => {
    if (boardRef.current) {
      setBoardIsClear(boardRef.current.isBoardClear());
    }
  };

  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="relative h-[85dvh]">
          <div
            className="absolute left-1/2 z-5 -translate-x-1/2 transition-all duration-600"
            style={{ top: `${calcMarginBoard(windowSize.height)}px` }}
          >
            {/* Board and controls */}
            <div className="flex flex-col items-center gap-2">
              <Board ref={boardRef} onDraw={handleBoardDraw} />
              <div className="h-[20px] md:h-[60px]" />
            </div>
            <div
              className="flex justify-center gap-[10px] transition-opacity duration-300"
              style={{ opacity: buttonVisible ? 1 : 0 }}
            >
              <CustomButton
                onClick={() => {
                  // TODO: Run neural network
                  console.log("RUN NEURAL NETWORK");
                }}
                text={boardIsClear ? "Draw Digit" : "Predict Digit"}
                icon="􀆿"
              />
              <div
                className={`transition-opacity duration-500 ${
                  boardIsClear ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                {!boardIsClear && (
                  <CustomButton
                    onClick={() => {
                      boardRef.current?.clearBoard();
                    }}
                    text="Clear"
                    secondary={true}
                  />
                )}
              </div>
            </div>
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

          <div
            className="absolute z-[0] w-full px-[30px] transition-all duration-300"
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
