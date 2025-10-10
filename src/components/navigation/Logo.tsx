import { FaRegFileAlt } from "react-icons/fa"; // document icon
import { HiOutlineSparkles } from "react-icons/hi2"; // for "smart" feel

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl select-none">
      {/* Icon Part */}
      <div className="relative flex items-center justify-center">
        <FaRegFileAlt className="text-gray-700 text-4xl drop-shadow-sm" />
        <HiOutlineSparkles className="text-red-500 text-xl absolute -top-1 -right-2" />
      </div>

      {/* Text Part */}
      <div className="text-2xl font-extrabold tracking-tight">
        <span className="text-gray-700">Smart</span>
        <span className="text-red-500">Docs</span>
      </div>
    </div>
  );
};
