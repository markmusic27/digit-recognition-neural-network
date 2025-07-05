import React from "react";

interface CustomTextLinkProps {
  mainText: string;
  linkText: string;
  href: string;
  className?: string;
}

const CustomTextLink: React.FC<CustomTextLinkProps> = ({
  mainText,
  linkText,
  href,
  className = "",
}) => {
  return (
    <p
      className={`font-sf text-center text-[20px] leading-[1.4] font-[300] text-[#9D9D9D] md:text-[22px] ${className}`}
    >
      {mainText}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sf ml-1 text-[#D7D7D7] underline transition hover:opacity-80"
      >
        {linkText}
      </a>
    </p>
  );
};

export default CustomTextLink;
