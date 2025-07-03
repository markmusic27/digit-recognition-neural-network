"use client";
import { useState, useEffect } from "react";
import Docs from "./Docs";

const MathPreview = () => {
  const [padding, setPadding] = useState("px-0");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPadding("px-2"); // 8px padding
      } else if (width < 1240) {
        setPadding("px-5"); // 20px padding
      } else {
        setPadding("px-0 w-[1200px] mx-auto"); // no padding
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    const height = window.innerHeight;
    window.scrollBy({ top: height * 0.87, left: 0, behavior: "smooth" });
  };

  return (
    <div className={`max-w-[1200px] ${padding} z-[1]`}>
      <div className="flex flex-col gap-[18px]">
        <button
          className={`justify-left flex cursor-pointer flex-row items-center gap-[8px] transition-opacity duration-200 ${isAtTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={handleScrollDown}
          type="button"
        >
          <p className="font-sf text-[14px] font-[400] tracking-[0.3px] text-[#333333] transition-all duration-200 hover:text-[#585858]">
            􀄩 Scroll to view the math
          </p>
        </button>
        <Docs />
      </div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default MathPreview;
