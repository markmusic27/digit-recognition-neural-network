interface CustomButtonProps {
  onClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
}

const CustomButton = ({
  onClick,
  text = "Hello World",
  icon,
}: CustomButtonProps) => {
  return (
    <button className="flex items-center bg-red-100" onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default CustomButton;
