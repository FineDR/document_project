import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaFileAlt, FaEye, FaDownload, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

const OfficialLetter = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    recipient: '',
    recipientTitle: '',
    recipientAddress: '',
    sender: '',
    senderTitle: '',
    senderAddress: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    content: '',
    closing: 'Sincerely,'
  });

  // State for current step in the journey
  const [currentStep, setCurrentStep] = useState(1);

  // State for preview mode
  const [previewMode, setPreviewMode] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // If on last step, generate the letter
      setPreviewMode(true);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (previewMode) {
      setPreviewMode(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit the form
  const handleSubmit = () => {
    // Here you would typically generate the document
    alert('Official letter created successfully!');
    // Navigate to the official letter page
    navigate('/official-letter');
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-red-900 flex items-center">
              <FaUser className="mr-2" /> Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-red-800 mb-2">Recipient Name</label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-red-800 mb-2">Recipient Title</label>
                <input
                  type="text"
                  name="recipientTitle"
                  value={formData.recipientTitle}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Director, HR Department"
                />
              </div>
            </div>
            <div>
              <label className="block text-red-800 mb-2">Recipient Address</label>
              <input
                type="text"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Example:
John Mdoe
Mlimani St, Kijitonyama
Kinondoni District
DAR ES SALAAM
11104
TANZANIA"
              />
            </div>

            <h3 className="text-xl font-semibold text-red-900 mt-8 flex items-center">
              <FaUser className="mr-2" /> Sender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-red-800 mb-2">Your Name</label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-red-800 mb-2">Your Title</label>
                <input
                  type="text"
                  name="senderTitle"
                  value={formData.senderTitle}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Marketing Manager"
                />
              </div>
            </div>
            <div>
              <label className="block text-red-800 mb-2">Your Address</label>
              <input
                type="text"
                name="senderAddress"
                value={formData.senderAddress}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="456 Career St, Apt 2B, City, Country"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-red-900 flex items-center">
              <FaCalendarAlt className="mr-2" /> Letter Details
            </h3>
            <div>
              <label className="block text-red-800 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-red-800 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Regarding: Job Application for Marketing Manager Position"
              />
            </div>

            <h3 className="text-xl font-semibold text-red-900 mt-8 flex items-center">
              <FaFileAlt className="mr-2" /> Letter Content
            </h3>
            <div>
              <label className="block text-red-800 mb-2">Letter Body</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Dear [Recipient Name],&#10;&#10;I am writing to express my interest in...&#10;&#10;Sincerely,"
              />
            </div>
            <div>
              <label className="block text-red-800 mb-2">Closing</label>
              <input
                type="text"
                name="closing"
                value={formData.closing}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Sincerely,"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-red-900 flex items-center">
              <FaEye className="mr-2" /> Preview Your Letter
            </h3>
            <div className="bg-white p-8 border border-red-200 rounded-lg shadow-md">
              <div className="mb-6">
                <p className="text-right text-red-700">{formData.senderAddress}</p>
                <p className="text-right text-red-700">{new Date(formData.date).toLocaleDateString()}</p>
              </div>

              <div className="mb-6">
                <p className="text-red-700">{formData.recipientTitle}</p>
                <p className="text-red-700">{formData.recipient}</p>
                <p className="text-red-700">{formData.recipientAddress}</p>
              </div>

              <div className="mb-6">
                <p className="text-red-700 font-semibold">Subject: {formData.subject}</p>
              </div>

              <div className="mb-6">
                <p className="text-red-700 whitespace-pre-line">{formData.content}</p>
              </div>

              <div className="mb-6">
                <p className="text-red-700">{formData.closing}</p>
                <p className="text-red-700 mt-4">{formData.sender}</p>
                <p className="text-red-700">{formData.senderTitle}</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Ready to generate your official letter?</h4>
              <p className="text-red-700">Click "Generate Letter" to create a professional PDF document that you can download and share.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Create Official Letter</h1>
          <p className="text-red-700">Follow the steps below to create your professional official letter</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === step
                    ? 'bg-red-600 text-white'
                    : currentStep > step
                      ? 'bg-red-100 text-red-600 border-2 border-red-600'
                      : 'bg-white text-red-600 border-2 border-red-200'
                    }`}
                >
                  {currentStep > step ? <FaCheck /> : step}
                </div>
                <span className={`mt-2 text-sm font-medium ${currentStep === step ? 'text-red-800' : 'text-red-600'
                  }`}>
                  {step === 1 ? 'Details' : step === 2 ? 'Content' : 'Preview'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-red-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-red-50 px-6 py-4 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 && !previewMode}
              className={`flex items-center px-4 py-2 rounded-lg ${currentStep === 1 && !previewMode
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>

            <button
              onClick={currentStep === 3 && !previewMode ? handleSubmit : nextStep}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {currentStep === 3 && !previewMode ? (
                <>
                  <FaDownload className="mr-2" /> Generate Letter
                </>
              ) : (
                <>
                  Continue <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLetter;