import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      id: 'risala',
      title: 'Risala',
      description: 'Formal event invitations and letters crafted with elegance and professionalism',
      icon: <FaFileAlt className="text-3xl text-redMain" />,
      buttonText: 'Create Risala',
    },
    // Add more document types here...
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
          {documentTypes.map((doc, idx) => {
            const isSpecial = idx === 0; // special animation for first card
            return (
              <motion.div
                key={doc.id}
                initial={isSpecial ? { opacity: 0, y: 50, scale: 0.9 } : { opacity: 0, y: 20 }}
                animate={isSpecial ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="bg-whiteBg rounded-xl shadow-md hover:shadow-xl border-t-4 border-redMain cursor-pointer transform transition-transform duration-300 hover:-translate-y-1"
                onClick={() => handleCreateDocument(doc.id)}
              >
                {/* Card Header */}
                <div className="p-6 flex items-center space-x-4 bg-redBg rounded-t-xl">
                  <div className="p-3 bg-whiteBg rounded-lg">{doc.icon}</div>
                  <h3 className="text-xl font-bold text-redMain dark:text-gray-100">{doc.title}</h3>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Documents;
