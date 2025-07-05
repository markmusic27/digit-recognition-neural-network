import React, { useEffect, useState } from "react";
import CustomTextLink from "./CustomTextLink";
import CustomButton from "./CustomButton";

const Docs = () => {
  const [height, setHeight] = useState(1000);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className="relative mb-[20px] rounded-[12px] border-[1px] border-[#272727] bg-black"
      style={{ height: `${height - 40}px` }}
    >
      <div className="absolute top-1/2 right-0 left-0 mx-auto flex -translate-y-1/2 flex-col items-center gap-[22px] md:gap-[28px]">
        <CustomTextLink
          mainText="Full math explanation is on GitHub repo"
          linkText="here"
          href="https://github.com/markmusic27/digit-recognition-neural-network/blob/main/README.md"
          className="max-w-[255px] md:max-w-[300px]"
        />
        <CustomTextLink
          mainText="Also love learning more about AI. Got good project ideas / something to share?"
          linkText="Dm me"
          href="https://x.com/markmusic27"
          className="max-w-[255px] md:max-w-[300px]"
        />
      </div>
      <div className="absolute right-0 bottom-[42px] left-0 flex w-full justify-center md:bottom-[70px]">
        <CustomButton
          text="Drop a Star?"
          icon="􀋂"
          iconSize={14}
          onClick={() =>
            window.open(
              "https://github.com/markmusic27/digit-recognition-neural-network",
              "_blank",
            )
          }
        />
      </div>
    </div>
  );
};

export default Docs;
