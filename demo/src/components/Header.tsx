interface HeaderProps {
  windowWidth: number;
}

const Header = ({ windowWidth }: HeaderProps) => {
  const getResponsiveTextSize = (width: number) => {
    if (width < 1000) return "32px"; // mobile
    if (width < 1200) return "36px"; // small tablet
    return "48px";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p
        className="font-louize text-center tracking-[0.3px] text-[#ffffff]"
        style={{ fontSize: getResponsiveTextSize(windowWidth) }}
      >
        Handwritten Digit Recognizer
      </p>
      <div className="flex flex-row">
        <p>By</p>
        <img src="/images/pfp.webp" className="h-[27px] w-[27px]" />
        <p>Mark Music</p>
      </div>
    </div>
  );
};

export default Header;
