interface HeaderProps {
  windowWidth: number;
}

const Header = ({ windowWidth }: HeaderProps) => {
  const getResponsiveHeaderSize = (width: number) => {
    if (width < 1000) return "32px"; // mobile
    if (width < 1200) return "36px"; // small tablet
    return "48px";
  };

  const getResponsiveTextScale = (width: number) => {
    if (width < 1000) return "0.8"; // mobile
    if (width < 1200) return "0.9"; // small tablet
    return "1";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p
        className="font-louize text-center font-[400] tracking-[0.3px] text-[#F5EEFF]"
        style={{ fontSize: getResponsiveHeaderSize(windowWidth) }}
      >
        Handwritten Digit Recognizer
      </p>
      <div
        className="group mt-[14px] flex flex-row items-center justify-center gap-[8px] hover:cursor-pointer"
        style={{ transform: `scale(${getResponsiveTextScale(windowWidth)})` }}
        onClick={() => {
          window.open(
            "https://github.com/markmusic27/digit-recognition-neural-network",
          );
        }}
      >
        <p className="font-sf text-[24px] font-[300] text-[#998AAA]">By</p>
        <img
          src="/images/pfp.webp"
          className="h-[27px] w-[27px] transition-transform duration-300 group-hover:-rotate-[-20deg]"
        />
        <p className="font-sf text-[24px] font-[300] text-[#998AAA]">
          Mark Music
        </p>
      </div>
    </div>
  );
};

export default Header;
