const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>Handwritten Digit Recognizer</p>
      <div className="flex flex-row">
        <p>By</p>
        <img src="/images/pfp.webp" className="h-[27px] w-[27px]" />
        <p>Mark Music</p>
      </div>
    </div>
  );
};

export default Header;
