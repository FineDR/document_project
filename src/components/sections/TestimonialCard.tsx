import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  avatarColor?: string;
}

const TestimonialCard = ({ 
  quote, 
  author, 
  position, 
  avatarColor = "bg-red-200" 
}: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <FaQuoteLeft className="text-red-200 text-2xl absolute top-4 left-4" />
      <p className="text-red-800 mb-4 pl-8">
        {quote}
      </p>
      <div className="flex items-center">
        <div className={`w-12 h-12 ${avatarColor} rounded-full mr-4`}></div>
        <div>
          <h4 className="font-semibold text-red-900">{author}</h4>
          <p className="text-red-600 text-sm">{position}</p>
        </div>
      </div>
      <FaQuoteRight className="text-red-200 text-2xl absolute bottom-4 right-4" />
    </div>
  );
};

export default TestimonialCard;