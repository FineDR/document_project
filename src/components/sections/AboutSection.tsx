import { FaUsers, FaLightbulb, FaAward, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const features = [
    {
      icon: <FaFileAlt />,
      title: 'Professional Quality',
      description:
        'Templates designed by experts to ensure your documents look professional and polished.',
    },
    {
      icon: <FaUsers />,
      title: 'User-Friendly',
      description:
        'No design or technical skills required. Our intuitive interface makes it simple for everyone.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Innovative Features',
      description:
        'We continuously update our platform with new features based on user feedback.',
    },
  ];

  return (
    <section className="py-16 text-paragraphGray transition-colors duration-300 border-t">
      <div className="container mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h2 className="text-h1 font-bold text-redMain mb-4">About SmartDocs</h2>
          <p className="text-base sm:text-lg text-subHeadingGray max-w-2xl mx-auto leading-relaxed">
            Empowering professionals with elegant document creation tools since 2023.
          </p>
        </header>

        {/* Story + Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-h2 font-bold text-redMain mb-4">Our Story</h3>
            <p className="text-base mb-3">
              GenDocs was founded with a simple mission: to make professional document creation accessible to everyone.
            </p>
            <p className="text-base mb-3">
              Our team of career experts, designers, and developers work together to create tools that are intuitive and easy to use.
            </p>
            <p className="text-base">
              Today, GenDocs serves thousands of professionals across various industries, helping them create documents that open doors to new opportunities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className=" p-8"
          >
            <div className="mb-6">
              <h3 className="text-h2 font-bold text-redMain mb-2 flex items-center">
                <FaLightbulb className="mr-2 text-redMain" /> Our Mission
              </h3>
              <p className="text-base text-paragraphGray">
                Empower professionals with elegant, easy-to-use tools for compelling documents and career growth.
              </p>
            </div>
            <div>
              <h3 className="text-h2 font-bold text-redMain mb-2 flex items-center">
                <FaAward className="mr-2 text-redMain" /> Our Vision
              </h3>
              <p className="text-base text-paragraphGray">
                To become the global leader in professional document creation, known for innovation, quality, and exceptional UX.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-h2 font-bold text-redMain mb-8 text-center">Why Choose GenDocs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-whiteBg dark:bg-grayBg p-6 rounded-xl shadow-md border-t-4 border-redMain dark:border-red-400 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-redMain mb-4 text-3xl">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-redMain mb-2">{feature.title}</h4>
                <p className="text-subHeadingGray text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
