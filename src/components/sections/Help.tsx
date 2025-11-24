import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I create a new document?",
    answer:
      "Navigate to the 'Create' section from the top navigation. You can select a document type like CV or Cover Letter, then fill in the details manually or use AI-assisted extraction.",
  },
  {
    question: "Can I save my documents and edit them later?",
    answer:
      "Yes! All your documents are saved under the 'Documents' section. You can open, edit, or export them anytime.",
  },
  {
    question: "Can AI help me fill in my CV?",
    answer:
      "Absolutely! Use the AI Extraction feature to automatically extract your work experience, skills, education, and projects from text or uploaded resumes.",
  },
  {
    question: "What file formats can I export my documents to?",
    answer:
      "You can export your documents as PDF files for professional sharing and printing.",
  },
  {
    question: "Do I need an account to use the platform?",
    answer:
      "Yes, signing up allows you to save documents, access AI features, and manage your profile. You can start with a free account or upgrade for premium features.",
  },
  {
    question: "How do I upgrade my subscription?",
    answer:
      "Go to the 'Pricing' page, select a plan that fits your needs, and follow the secure upgrade instructions. Premium unlocks unlimited documents, AI enhancements, and advanced templates.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, all documents and personal data are stored securely. We use industry-standard encryption and never share your data without consent.",
  },
];


const Help = () => {
  return (
    <main className="py-16 text-paragraphGray transition-colors duration-300">
      <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-h1 font-bold text-redMain mb-4">Help & FAQ</h1>
          <p className="text-base sm:text-lg text-subHeadingGray max-w-2xl mx-auto leading-relaxed">
            Frequently asked questions about our document creation platform.
          </p>
        </header>

        {/* FAQ Grid */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-whiteBg dark:bg-grayBg p-6 rounded-xl shadow-md border-t-4 border-redMain dark:border-red-400 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-h2 text-redMain mb-2">{faq.question}</h2>
              <p className="text-base text-subHeadingGray">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        {/* <p className="text-center text-sm text-subHeadingGray mt-12">
          Still have questions?{" "}
          <a
            href="/contact"
            className="text-redMain hover:underline font-medium"
          >
            Contact Support
          </a>
          .
        </p> */}
      </div>
    </main>
  );
};

export default Help;
