import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I create a new document?",
    answer:
      "Navigate to the 'Create Document' section from the home page or the top navigation and select the type of document you want to create, such as CV or Cover Letter.",
  },
  {
    question: "Can I save my documents and edit them later?",
    answer:
      "Yes! All your documents are saved in your account under the 'Documents' section where you can edit or export them anytime.",
  },
  {
    question: "What file formats can I export to?",
    answer:
      "You can export your documents as PDF and Word (.docx) files for easy sharing and printing.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes, our free plan allows you to create up to 3 documents with access to basic templates.",
  },
  {
    question: "How do I upgrade my subscription?",
    answer:
      "Go to the 'Pricing' page and select the plan that fits your needs. Follow the instructions to upgrade securely.",
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
              className="p-6 bg-whiteBg dark:bg-grayBg rounded-2xl shadow-md border border-redBg dark:border-grayBg hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-h2 text-redMain mb-2">{faq.question}</h2>
              <p className="text-base text-subHeadingGray">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <p className="text-center text-sm text-subHeadingGray mt-12">
          Still have questions?{" "}
          <a
            href="/contact"
            className="text-redMain hover:underline font-medium"
          >
            Contact Support
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default Help;
