import { NavLink, useLocation } from "react-router-dom";
import image from "../../assets/imagehome.jpg";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FaFileAlt, FaEnvelope } from "react-icons/fa";
  export const documentTypes = [
    { name: "CV", icon: <FaFileAlt className="text-lg sm:text-xl" />, description: "Professional curriculum vitae" },
    { name: "Official Letter", icon: <FaEnvelope className="text-lg sm:text-xl" />, description: "Professional official letter template" }
  ];
const Home = () => {
  const location = useLocation();
  const baseBtnClass =
    "px-4 py-2 sm:px-6 rounded-md text-sm md:text-base font-medium transition-all duration-300 ease-in-out flex items-center justify-center";
  const activeBtnClass =
    "bg-red-600 text-white border border-red-600 shadow-lg";
  const inactiveBtnClass =
    "border border-red-600 text-white bg-red-600 hover:bg-red-600 hover:text-white";



  return (
    <div className="relative min-h-[80vh] sm:min-h-screen mt-12 w-full">
      {/* Background image */}
      <img
        src={image}
        alt="GenDocs Background"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* Reddish overlay */}
      <div className="absolute inset-0 bg-redBg bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-90 z-10" />

      {/* Decorations (fewer on mobile) */}
      <div className="absolute inset-0 z-20 ">
        <MdOutlineWaterDrop className="absolute bottom-3 right-3 text-red-300 text-2xl sm:text-4xl opacity-70" />
        <MdOutlineWaterDrop className="absolute bottom-3 left-3 text-red-300 text-2xl sm:text-4xl opacity-70" />
        <MdOutlineWaterDrop className="absolute top-3 right-3 text-red-300 text-2xl sm:text-4xl opacity-70" />
        <MdOutlineWaterDrop className="absolute top-3 left-3 text-red-300 text-2xl sm:text-4xl opacity-70" />

        {/* Extra decorations only visible on sm+ */}
        <div className="hidden sm:block">
          <MdOutlineWaterDrop className="absolute top-1/2 right-1/4 text-red-300 text-3xl opacity-60" />
          <MdOutlineWaterDrop className="absolute top-1/3 left-1/3 text-red-300 text-3xl opacity-60" />
        </div>
      </div>

      {/* Main content */}
      <section className="relative z-30 flex flex-col justify-center items-center min-h-[80vh] sm:min-h-screen text-center px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-extrabold text-white drop-shadow mb-3 sm:mb-6">
            Welcome to <span className="text-gray-900 dark:text-redMain">SmartDocs</span>
          </h1>
          <p className="text-white text-xs sm:text-base md:text-lg lg:text-xl font-light mb-6 sm:mb-10">
            One professional platform for generating documents — effortlessly.
          </p>

          {/* Document types */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-12">
            {documentTypes.map((doc, i) => (
              <div
                key={i}
                className="bg-red-800/30 backdrop-blur-sm p-3 sm:p-6 rounded-lg border border-red-600/50 hover:bg-red-800/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="text-red-300 mb-1 sm:mb-3">{doc.icon}</div>
                  <h3 className="text-white font-semibold text-sm sm:text-lg mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-red-200 text-xs sm:text-sm text-center">
                    {doc.description}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center w-full max-w-sm mx-auto">
          {/* <NavLink
            to="/create/document"
            className={() => {
              const isActive =
                location.pathname === "/" ||
                location.pathname === "/create/document";
              return `${baseBtnClass} ${
                isActive ? activeBtnClass : inactiveBtnClass
              }`;
            }}
          >
            Create Document
          </NavLink> */}

          <NavLink
            to="/documents"
            className={() => {
              const isActive = location.pathname === "/documents";
              return `${baseBtnClass} ${
                isActive ? activeBtnClass : inactiveBtnClass
              }`;
            }}
          >
            View Document Type
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;
