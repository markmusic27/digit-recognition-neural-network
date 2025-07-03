import React, { useEffect, useState } from "react";

function AnimatedText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (text !== displayed) {
      setFade(true);
      const timeout = setTimeout(() => {
        setDisplayed(text);
        setFade(false);
      }, 150); // duration of fade out
      return () => clearTimeout(timeout);
    }
  }, [text, displayed]);

  return (
    <span
      className={`transition-opacity duration-200 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {displayed}
    </span>
  );
}

interface CustomButtonProps {
  onClick?: () => void;
  text?: string;
  icon?: string;
  secondary?: boolean;
}

const CustomButton = ({
  onClick,
  text,
  icon,
  secondary = false,
}: CustomButtonProps) => {
  return (
    <div className="rounded-[100px] bg-[#0000004d] p-[4px] outline-[1px] outline-[#ffffff4d] transition-all duration-300 hover:scale-[1.02] hover:cursor-pointer">
      <button
        className={`flex items-center gap-[10px] rounded-[100px] bg-[#ffffff${!secondary ? "e6" : "4d"}] px-[20px] py-[12px] transition-all duration-200 hover:cursor-pointer`}
        style={{
          transitionProperty:
            "width,background,color,border,box-shadow,opacity",
        }}
        onClick={onClick}
      >
        {icon == undefined ? null : (
          <p className="font-sf text-[18px] font-[400] text-[#1A1A1A]">
            {icon}
          </p>
        )}
        <p
          className={`font-sf text-[16px] font-[400] text-[${!secondary ? "#1A1A1A" : "#F6F6F6"}]`}
        >
          <AnimatedText text={text ?? ""} />
        </p>
      </button>
    </div>
  );
};

export default CustomButton;
