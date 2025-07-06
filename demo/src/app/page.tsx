"use client";

import { useState, useEffect, useRef } from "react";
import Board from "~/components/Board";
import type { BoardHandle } from "~/components/Board";
import MathPreview from "~/components/MathPreview";
import Blur from "~/components/Blur";
import { useActivationsStore } from "~/store/activations";
import Header from "~/components/Header";
import { useRouter } from "next/navigation";
import CustomButton from "~/components/CustomButton";

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [headerVisible, setHeaderVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [boardIsClear, setBoardIsClear] = useState(true);
  const boardRef = useRef<BoardHandle>(null);
  const router = useRouter();
  const { setActivations } = useActivationsStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [blursVisible, setBlursVisible] = useState(false);

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

    // Animate in blurs after 1000ms
    const blurTimer = setTimeout(() => {
      setBlursVisible(true);
    }, 1000);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(buttonTimer);
      clearTimeout(blurTimer);
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

    setActivations(pixels.flat());
  };

  return (
    <main className="bg-black">
      <div className="flex w-full flex-col">
        <div className="relative h-[85dvh]">
          {/* Tutorial */}
          <div
            className="absolute top-[4%] left-1/2 z-[201] -translate-x-1/2 transition-all duration-[400ms]"
            style={{ opacity: showTutorial ? 1 : 0 }}
          >
            <div className="rounded-[17px] border-[1px] border-[#2A2A2A] bg-[#0A0A0A] px-[26px] py-[14px] text-center text-[#939393]">
              <p className="font-sf cursor-default text-[16px] font-[400px] tracking-wide whitespace-nowrap">
                Try drawing a 2 in the box below!
              </p>
            </div>
          </div>

          {/* Header */}
          <div
            className="absolute left-1/2 z-5 -translate-x-1/2 transition-all duration-600"
            style={{ top: `${calcMarginBoard(windowSize.height)}px` }}
          >
            {/* Board and controls */}
            <div className="flex flex-col items-center gap-2">
              <Board
                ref={boardRef}
                onDraw={handleBoardDraw}
                scale={showTutorial ? 0.05 : 0}
              />
              <div className="h-[20px] md:h-[60px]" />
            </div>
            <div
              className="flex justify-center gap-[10px] transition-opacity duration-300"
              style={{ opacity: buttonVisible ? 1 : 0 }}
            >
              <CustomButton
                onClick={() => {
                  if (!boardIsClear) {
                    router.push("/predict");
                    return;
                  }

                  setShowTutorial(true);
                  setTimeout(() => setShowTutorial(false), 5000);
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
          <Blur
            blur={10}
            zIndex={4}
            top={calcMarginBoard(windowSize.height)}
            opacity={blursVisible ? 1 : 0}
            className="transition-opacity duration-700"
          />
          <Blur
            blur={100}
            zIndex={3}
            top={calcMarginBoard(windowSize.height)}
            opacity={blursVisible ? 1 : 0}
            className="transition-opacity duration-700"
          />
          <Blur
            blur={300}
            zIndex={2}
            top={calcMarginBoard(windowSize.height)}
            opacity={blursVisible ? 1 : 0}
            className="transition-opacity duration-700"
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
