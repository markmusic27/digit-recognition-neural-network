"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const BRUSH_RADIUS = 1; // in pixels
const BRUSH_STRENGTH = 0.4; // Increment per stroke

export type BoardHandle = {
  getActivations: () => number[][];
  clearBoard: () => void;
  isBoardClear: () => boolean;
};

type BoardProps = {
  onDraw?: (pixels: number[][]) => void;
};

const Board = forwardRef<BoardHandle, BoardProps>(({ onDraw }, ref) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<number[][]>(
    Array.from({ length: 28 }, () => Array(28).fill(0)),
  );
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorInside, setCursorInside] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Returns true if all pixels are 0
  const isBoardClear = useCallback(() => {
    return pixels.every((row) => row.every((pixel) => pixel === 0));
  }, [pixels]);

  // Clear board function
  const clearBoard = useCallback(() => {
    setPixels(Array.from({ length: 28 }, () => Array(28).fill(0)));
    if (onDraw) {
      setTimeout(
        () => onDraw(Array.from({ length: 28 }, () => Array(28).fill(0))),
        0,
      );
    }
  }, [onDraw]);

  // Expose methods to parent
  useImperativeHandle(
    ref,
    () => ({
      getActivations: () => pixels,
      clearBoard,
      isBoardClear,
    }),
    [pixels, clearBoard, isBoardClear],
  );

  // Helper to get pixel coordinates from a mouse event
  const getPixelCoordinates = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 10);
      const y = Math.floor((e.clientY - rect.top) / 10);
      if (x >= 0 && x < 28 && y >= 0 && y < 28) {
        return { x, y };
      }
      return null;
    },
    [],
  );

  // Helper to get pixel coordinates from a touch event
  const getTouchPixelCoordinates = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const touch = e.touches[0] ?? e.changedTouches[0];
      if (!touch) return null;
      const x = Math.floor((touch.clientX - rect.left) / 10);
      const y = Math.floor((touch.clientY - rect.top) / 10);
      if (x >= 0 && x < 28 && y >= 0 && y < 28) {
        return { x, y };
      }
      return null;
    },
    [],
  );

  // Soft, thick brush: increment pixel and neighbors in a circular area
  const drawPixel = useCallback(
    (centerX: number, centerY: number) => {
      setPixels((prev) => {
        const newPixels = prev.map((row) => [...row]);
        let changed = false;
        for (let dy = -BRUSH_RADIUS; dy <= BRUSH_RADIUS; dy++) {
          for (let dx = -BRUSH_RADIUS; dx <= BRUSH_RADIUS; dx++) {
            const x = centerX + dx;
            const y = centerY + dy;
            if (
              x >= 0 &&
              x < 28 &&
              y >= 0 &&
              y < 28 &&
              dx * dx + dy * dy <= BRUSH_RADIUS * BRUSH_RADIUS &&
              newPixels[y] &&
              typeof newPixels[y][x] === "number"
            ) {
              const before = newPixels[y][x];
              newPixels[y][x] = Math.min(1, newPixels[y][x] + BRUSH_STRENGTH);
              if (newPixels[y][x] !== before) changed = true;
            }
          }
        }
        // Only call onDraw if something changed
        if (changed && onDraw) {
          setTimeout(() => onDraw(newPixels.map((row) => [...row])), 0);
        }
        return newPixels;
      });
    },
    [onDraw],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDrawing(true);
      const coords = getPixelCoordinates(e);
      if (coords) {
        drawPixel(coords.x, coords.y);
      }
    },
    [getPixelCoordinates, drawPixel],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });
      if (!isDrawing) return;
      const coords = getPixelCoordinates(e);
      if (coords) {
        drawPixel(coords.x, coords.y);
      }
    },
    [isDrawing, getPixelCoordinates, drawPixel],
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setCursorInside(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setCursorInside(true);
  }, []);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDrawing(true);
      const coords = getTouchPixelCoordinates(e);
      if (coords) {
        drawPixel(coords.x, coords.y);
      }
    },
    [getTouchPixelCoordinates, drawPixel],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isDrawing) return;
      const coords = getTouchPixelCoordinates(e);
      if (coords) {
        drawPixel(coords.x, coords.y);
      }
    },
    [isDrawing, getTouchPixelCoordinates, drawPixel],
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  }, []);

  // Lock body scroll when drawing, and prevent touchmove globally
  useEffect(() => {
    if (isDrawing) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener("touchmove", preventTouchMove);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawing]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={boardRef}
        className="relative h-[280px] w-[280px] cursor-crosshair overflow-hidden bg-black outline-[3px] outline-[#ffffff4d] transition-all duration-500 hover:scale-[1.01] md:outline-[6px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: "none", // Hide default cursor
        }}
      >
        {/* Drawing grid */}
        <div className="absolute inset-0 grid grid-cols-28 grid-rows-28">
          {pixels.map((row, y) =>
            row.map((pixel, x) => (
              <div
                key={`${x}-${y}`}
                className="h-[10px] w-[10px] bg-white"
                style={{ opacity: pixel }}
              />
            )),
          )}
        </div>
        {/* Custom cursor (thicker) */}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute z-10 rounded-full bg-white"
          style={{
            width: `${(BRUSH_RADIUS * 2 + 1) * 10}px`,
            height: `${(BRUSH_RADIUS * 2 + 1) * 10}px`,
            left: cursorPosition.x - BRUSH_RADIUS * 10,
            top: cursorPosition.y - BRUSH_RADIUS * 10,
            transform: "translate(0, 0)",
            opacity: cursorInside ? 0.5 : 0,
          }}
        />
      </div>
    </div>
  );
});

Board.displayName = "Board";

export default Board;
