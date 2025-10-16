import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaEnvelope, FaArrowRight, FaEdit, FaLayerGroup, FaEye, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "cv",
      title: "CV Creation",
      icon: <FaFileAlt className="text-2xl text-redMain" />,
      description:
        "Build an ATS-friendly CV that highlights your experience, skills, and strengths — crafted to impress recruiters.",
      buttonText: "Create CV",
      path: "/create/cv",
    },
    {
      id: "official-letter",
      title: "Official Letter Creation",
      icon: <FaEnvelope className="text-2xl text-redMain" />,
      description:
        "Generate professional, well-formatted letters for job applications, business communication, and more.",
      buttonText: "Create Letter",
      path: "/create/official-letter",
    },
  ];

  const stages = [
    { icon: <FaEdit />, title: "Fill Details" },
    { icon: <FaLayerGroup />, title: "Choose Template" },
    { icon: <FaEye />, title: "Preview" },
    { icon: <FaDownload />, title: "Download" },
  ];

  const handleCreateService = (path: string) => {
    navigate(path);
  };

  return (
    <section className="py-16 text-paragraphGray transition-colors duration-300">
      <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-h1 font-bold text-redMain mb-4">Our Services</h1>
          <p className="text-base sm:text-lg text-subHeadingGray max-w-2xl mx-auto leading-relaxed">
            Professional document creation platform designed to save you time and help you present yourself effectively.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 mb-20">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-8 "
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-redMain/10 group-hover:bg-redMain/20 transition-colors duration-300">
                  {service.icon}
                </div>
                <h2 className="text-h2 font-semibold text-redMain">{service.title}</h2>
              </div>

              <p className="text-base text-subHeadingGray mb-8 leading-relaxed">{service.description}</p>

              <button
                onClick={() => handleCreateService(service.path)}
                className="w-full flex items-center justify-center gap-3 py-3 bg-redMain text-white rounded-xl font-semibold hover:bg-redMain/90 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                {service.buttonText}
                <FaArrowRight className="text-sm sm:text-base" />
              </button>
            </div>
          ))}
        </div>

        {/* Stages / Workflow */}
        <div className="text-center mb-16">
          <h3 className="text-h2 font-bold text-redMain mb-8">How It Works</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12">
            {stages.map((stage, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-redMain/10 text-redMain rounded-full mb-4 text-2xl">
                  {stage.icon}
                </div>
                <span className="text-subHeadingGray font-semibold">{stage.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Info / Benefits */}
        <div className="text-center">
          <h3 className="text-h2 font-bold text-redMain mb-4">Why Choose Our Platform?</h3>
          <p className="text-subHeadingGray max-w-xl mx-auto leading-relaxed">
            Every template is crafted to save your time and make your documents stand out. We focus on professionalism, clarity, and user-friendly design.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
