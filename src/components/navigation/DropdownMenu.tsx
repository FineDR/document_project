import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";

interface DropdownItem {
  name: string;
  path: string;
  active?: boolean;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  onItemClick?: () => void;
}

export const DropdownMenu = ({ title, items, onItemClick }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  
  const handleMouseLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 200);
  };
  
  const toggleDropdown = () => setOpen((prev) => !prev);
  
  const closeDropdown = () => {
    setOpen(false);
    if (onItemClick) onItemClick();
  };
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-red-700 hover:text-red-500 text-lg transition flex items-center gap-1"
        onClick={toggleDropdown}
      >
        {title}
        <span className="text-sm text-gray-600">
          <RiArrowDropDownLine />
        </span>
      </button>
      <div
        className={`absolute left-0 mt-1 bg-whiteBg shadow-lg rounded-lg z-[9999] w-48 transition-all duration-200 border border-gray-200 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
        }`}
      >
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeDropdown}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm transition-colors ${
                isActive 
                  ? "bg-gray-600 text-white text-lg text" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};