import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaFileImage, FaFileSignature } from 'react-icons/fa';

const Documents = () => {
  const navigate = useNavigate();
  
  // Mock data for document types - matching your route configuration
  const documentTypes = [
    {
      id: 'cv',
      title: 'CV',
      description: 'Professional curriculum vitae showcasing your skills, experience, and qualifications',
      icon: <FaFileAlt className="text-2xl" />,
      buttonText: 'Create CV'
    },
    {
      id: 'official-letter',
      title: 'Official Letter',
      description: 'Formal letter template for official communications and correspondence',
      icon: <FaEnvelope className="text-2xl" />,
      buttonText: 'Create Official Letter'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your work and projects in a professional portfolio',
      icon: <FaFileImage className="text-2xl" />,
      buttonText: 'Create Portfolio'
    },
    {
      id: 'certificate',
      title: 'Certificate',
      description: 'Create professional certificates for achievements and qualifications',
      icon: <FaFileSignature className="text-2xl" />,
      buttonText: 'Create Certificate'
    }
  ];

  // Function to handle navigation to document creation page
  const handleCreateDocument = (docId: string) => {
    // Navigate to the specific document creation page based on your routes
    navigate(`/create/${docId}`);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-red-900 mb-4">Document Types</h1>
          <p className="text-lg text-red-700 max-w-2xl mx-auto">
            Select a document type to create. Choose from our variety of professional document templates.
          </p>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentTypes.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-t-4 border-red-500 cursor-pointer"
              onClick={() => handleCreateDocument(doc.id)}
            >
              {/* Card Header */}
              <div className="p-6 bg-red-100 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-white text-red-700">
                  {doc.icon}
                </div>
                <h3 className="text-xl font-bold text-red-900">{doc.title}</h3>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <p className="text-red-800 mb-6">{doc.description}</p>
                
                {/* Create Button */}
                <button
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 text-red-700 bg-white border border-red-200 hover:bg-red-50"
                >
                  {doc.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Documents;