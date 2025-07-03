interface CustomButtonProps {
  onClick?: () => void;
  text?: string;
  icon?: string;
}

const CustomButton = ({ onClick, text, icon }: CustomButtonProps) => {
  return (
    <div className="rounded-[100px] bg-[#0000004d] p-[4px] outline-[1px] outline-[#ffffff4d] transition-all duration-300 hover:scale-[1.02] hover:cursor-pointer">
      <button
        className="flex items-center gap-[10px] rounded-[100px] bg-white px-[20px] py-[12px] hover:cursor-pointer"
        onClick={onClick}
      >
        <p className="font-sf text-[18px] font-[400] text-[#1A1A1A]">{icon}</p>
        <p className="font-sf text-[16px] font-[400] text-[#1A1A1A]">{text}</p>
      </button>
    </div>
  );
};

export default CustomButton;
