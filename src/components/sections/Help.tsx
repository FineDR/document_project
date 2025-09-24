const Help = () => {
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

  return (
    <main className="max-w-screen-lg mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-primary mb-12 text-center">Help & FAQ</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {faqs.map(({ question, answer }, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-red-500 mb-2">{question}</h2>
            <p className="text-gray-700">{answer}</p>
          </div>
        ))}
      </section>

      <p className="text-center text-sm text-gray-500 mt-10">
        Still have questions?{" "}
        <a href="/contact" className="text-blue-600 hover:underline">
          Contact Support
        </a>
        .
      </p>
    </main>
  );
};

export default Help;
