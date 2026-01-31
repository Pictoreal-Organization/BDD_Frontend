import React from "react";
import { useLocation } from "wouter";

interface ArrowBtnProps {
  text: string;
  path: string;
  textColor?: string;
  bgColor?: string;
  hoverColor?: string;
  borderColor?: string | null;
  circleBg?: string;
  arrowColor?: string;
}

const ArrowBtn = ({
  text,
  path,
  textColor = "#DDF1FF",
  bgColor = "#111C33",
  hoverColor = "#003366",
  borderColor = null,
  circleBg = "#DDF1FF",
  arrowColor = "#111C33",
}: ArrowBtnProps) => {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    // Check if path is external (http/https)
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      setLocation(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center pl-6 pr-2 py-1.5 rounded-full 
        transform transition duration-500 ease-in-out hover:scale-105 font-body cursor-pointer`}
      style={{
        backgroundColor: bgColor,
        border: borderColor ? `1px solid ${borderColor}` : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
        if (borderColor) e.currentTarget.style.borderColor = borderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
        if (borderColor) e.currentTarget.style.borderColor = borderColor;
      }}
    >
      <span style={{ color: textColor }} className="font-medium">{text}</span>
      <span
        className="ml-3 w-8 h-8 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45"
        style={{
          backgroundColor: circleBg,
          border: borderColor ? `1px solid ${borderColor}` : "none",
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke={arrowColor}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 7L7 17M17 7h-6m6 0v6"
          />
        </svg>
      </span>
    </button>
  );
};

export default ArrowBtn;