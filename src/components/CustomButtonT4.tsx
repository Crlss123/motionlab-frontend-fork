import { useState } from "react";
import './CustomButtonT4.css';

interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean; // Nueva propiedad opcional
}

const CustomButton = ({ label, onClick, disabled = false }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      className={`custombutton ${disabled ? 'disabled' : ''}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CustomButton;