import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaFileImage, FaFileSignature, FaArrowRight } from 'react-icons/fa';

const Documents = () => {
  const navigate = useNavigate();

  const documentTypes = [
    {
      id: 'cv',
      title: 'CV',
      description: 'Professional curriculum vitae showcasing your skills, experience, and qualifications',
      icon: <FaFileAlt className="text-3xl text-redMain" />,
      buttonText: 'Create CV',
    },
    {
      id: 'official-letter',
      title: 'Official Letter',
      description: 'Formal letter template for official communications and correspondence',
      icon: <FaEnvelope className="text-3xl text-redMain" />,
      buttonText: 'Create Official Letter',
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your work and projects in a professional portfolio',
      icon: <FaFileImage className="text-3xl text-redMain" />,
      buttonText: 'Create Portfolio',
    },
    {
      id: 'certificate',
      title: 'Certificate',
      description: 'Create professional certificates for achievements and qualifications',
      icon: <FaFileSignature className="text-3xl text-redMain" />,
      buttonText: 'Create Certificate',
    },
  ];

  const handleCreateDocument = (docId: string) => {
    navigate(`/create/${docId}`);
  };

  return (
    <section className="py-12 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-h1 font-bold text-redMain mb-4 mt-14">Document Types</h1>
          <p className="text-h2 text-subHeadingGray max-w-2xl mx-auto">
            Select a document type to create. Choose from our variety of professional document templates.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {documentTypes.map((doc) => (
            <div
              key={doc.id}
              className="bg-whiteBg rounded-xl shadow-md hover:shadow-xl border-t-4 border-redMain cursor-pointer transform transition-transform duration-300 hover:-translate-y-1"
              onClick={() => handleCreateDocument(doc.id)}
            >
              {/* Card Header */}
              <div className="p-6 flex items-center space-x-4 bg-redBg rounded-t-xl">
                <div className="p-3 bg-whiteBg rounded-lg">{doc.icon}</div>
                <h3 className="text-xl font-bold text-redMain">{doc.title}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-subHeadingGray">{doc.description}</p>
                <button
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-button text-redMain bg-whiteBg border border-redMain hover:bg-redMain hover:text-white transition-colors duration-300"
                >
                  {doc.buttonText} <FaArrowRight />
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
