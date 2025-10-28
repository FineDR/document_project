import logo from "../../assets/logo_docs.png";

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2 p-3 rounded-xl select-none">
      {/* Icon Part */}
      <div className="relative flex items-center justify-center">
        <img src={logo} alt="Smart Docs Logo" className="h-10 w-10" />
        {/* Optional: add sparkle icon overlay if desired */}
        {/* <HiOutlineSparkles className="text-primary text-xl absolute -top-1 -right-2" /> */}
      </div>

      {/* Text Part */}
      <div className="text-2xl font-bold tracking-tight flex gap-1">
        <span className="text-text dark:text-text">Smart</span>
        <span className="text-primary">Docs</span>
      </div>
    </div>
  );
};
