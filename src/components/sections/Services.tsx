import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaArrowRight, FaCheck } from 'react-icons/fa';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'cv',
      title: 'CV Creation',
      icon: <FaFileAlt className="text-2xl sm:text-3xl" />,
      description:
        'Create ATS-friendly CVs highlighting your skills, experience, and qualifications. Designed by experts to help you stand out.',
      features: [
        'Multiple professional templates',
        'Real-time preview',
        'Easy customization',
        'Export to PDF or Word',
        'ATS-friendly formatting',
      ],
      buttonText: 'Create CV',
      path: '/create/cv',
    },
    {
      id: 'official-letter',
      title: 'Official Letter Creation',
      icon: <FaEnvelope className="text-2xl sm:text-3xl" />,
      description:
        'Generate professional letters for job applications, business correspondence, and formal communications.',
      features: [
        'Professional letter templates',
        'Step-by-step guidance',
        'Personal and recipient details',
        'Formal formatting',
        'Download and share',
      ],
      buttonText: 'Create Letter',
      path: '/create/official-letter',
    },
  ];

  const handleCreateService = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl font-bold text-red-900 mb-3 sm:mb-4">
            Our Services
          </h1>
          <p className="text-sm sm:text-lg text-red-700 max-w-2xl mx-auto">
            Professional document creation services to help you present yourself effectively.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-red-500"
            >
              {/* Service Header */}
              <div className="p-4 sm:p-6 bg-red-100 flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 rounded-lg bg-white text-red-700">
                  {service.icon}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-red-900">
                  {service.title}
                </h2>
              </div>

              {/* Service Body */}
              <div className="p-4 sm:p-6">
                <p className="text-red-800 mb-4 sm:mb-6 text-sm sm:text-base">
                  {service.description}
                </p>

                {/* Features List */}
                <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2 sm:mb-3">
                  Key Features:
                </h3>
                <ul className="mb-4 sm:mb-6 space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-red-600 mt-1 mr-2 flex-shrink-0 text-sm sm:text-base" />
                      <span className="text-red-800 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Process Steps */}
                <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2 sm:mb-3">
                  How It Works:
                </h3>
                <div className="mb-4 sm:mb-6 space-y-3">
                  {['Choose a Template', 'Add Your Information', 'Generate & Download'].map(
                    (step, i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold mr-3 text-xs sm:text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-red-900 text-sm sm:text-base">{step}</h4>
                          <p className="text-red-700 text-xs sm:text-sm">
                            {i === 0
                              ? 'Select from professional templates'
                              : i === 1
                              ? 'Fill in your details'
                              : 'Download in your preferred format'}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Call to Action */}
                <button
                  onClick={() => handleCreateService(service.path)}
                  className="w-full py-2 sm:py-3 px-4 bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 hover:bg-red-700 flex items-center justify-center text-sm sm:text-base"
                >
                  {service.buttonText}
                  <FaArrowRight className="ml-2 text-xs sm:text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 sm:mt-16 bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-6 text-center">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4">
              <div className="bg-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaFileAlt className="text-lg sm:text-2xl text-red-700" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-red-900">
                Professional Quality
              </h3>
              <p className="text-red-700 text-xs sm:text-sm">
                Templates designed by experts for professional, polished documents.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="bg-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaEnvelope className="text-lg sm:text-2xl text-red-700" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-red-900">
                Time-Saving
              </h3>
              <p className="text-red-700 text-xs sm:text-sm">
                Create professional documents in minutes, not hours.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="bg-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaCheck className="text-lg sm:text-2xl text-red-700" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-red-900">
                Easy to Use
              </h3>
              <p className="text-red-700 text-xs sm:text-sm">
                Step-by-step guidance makes document creation simple.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
