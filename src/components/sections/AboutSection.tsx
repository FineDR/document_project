import { FaCheck, FaUsers, FaLightbulb, FaAward, FaFileAlt } from 'react-icons/fa';
import TestimonialCard from '../sections/TestimonialCard';

const AboutSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "GenDocs helped me create a professional CV that landed me interviews at top companies. The templates are beautiful and the process is incredibly simple.",
      author: "Sarah Johnson",
      position: "Software Engineer",
      avatarColor: "bg-red-200"
    },
    {
      id: 2,
      quote: "The official letter templates saved me hours of work. I was able to create professional correspondence that impressed my clients and helped grow my business.",
      author: "Michael Chen",
      position: "Business Consultant",
      avatarColor: "bg-blue-200"
    },
    {
      id: 3,
      quote: "As a recent graduate, I was struggling to create a CV that stood out. GenDocs made it easy to create a professional document that got me noticed by employers.",
      author: "Emily Rodriguez",
      position: "Marketing Specialist",
      avatarColor: "bg-green-200"
    },
    {
      id: 4,
      quote: "The variety of templates and customization options in GenDocs is impressive. I've used it for both my CV and official letters with great results.",
      author: "David Kim",
      position: "Project Manager",
      avatarColor: "bg-purple-200"
    }
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-red-900 mb-3 sm:mb-4">
            About GenDocs
          </h2>
          <p className="text-base sm:text-lg text-red-700 max-w-prose mx-auto">
            Empowering professionals with elegant document creation tools since 2023
          </p>
        </div>
        
        {/* Story + Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center mb-12 sm:mb-16">
          {/* Company Description */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-3 sm:mb-4">Our Story</h3>
            <p className="text-red-800 mb-3 sm:mb-4 text-sm sm:text-base">
              GenDocs was founded with a simple mission: to make professional document creation accessible to everyone. 
              We believe that everyone deserves to present themselves in the best possible light, regardless of their design skills or technical knowledge.
            </p>
            <p className="text-red-800 mb-3 sm:mb-4 text-sm sm:text-base">
              Our team of career experts, designers, and developers work together to create tools that are not only powerful 
              but also intuitive and easy to use. We understand the challenges of job searching and professional communication, 
              and we're committed to providing solutions that make a difference.
            </p>
            <p className="text-red-800 text-sm sm:text-base">
              Today, GenDocs serves thousands of professionals across various industries, helping them create documents that open doors 
              to new opportunities and career advancement.
            </p>
          </div>
          
          {/* Mission & Vision */}
          <div className="bg-red-50 p-6 sm:p-8 rounded-xl border border-red-200">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-2 flex items-center">
                <FaLightbulb className="mr-2" /> Our Mission
              </h3>
              <p className="text-red-800 text-sm sm:text-base">
                To empower professionals with elegant, easy-to-use tools that help them create compelling documents and 
                advance their careers with confidence.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-2 flex items-center">
                <FaAward className="mr-2" /> Our Vision
              </h3>
              <p className="text-red-800 text-sm sm:text-base">
                To become the global leader in professional document creation, known for innovation, quality, 
                and exceptional user experience.
              </p>
            </div>
          </div>
        </div>
        
        {/* Key Features */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-6 sm:mb-8 text-center">Why Choose GenDocs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="text-red-600 mb-3 sm:mb-4">
                <FaFileAlt className="text-2xl sm:text-3xl" />
              </div>
              <h4 className="text-lg font-semibold text-red-900 mb-2">Professional Quality</h4>
              <p className="text-red-700 text-sm sm:text-base">
                Templates designed by experts to ensure your documents look professional and polished.
              </p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="text-red-600 mb-3 sm:mb-4">
                <FaUsers className="text-2xl sm:text-3xl" />
              </div>
              <h4 className="text-lg font-semibold text-red-900 mb-2">User-Friendly</h4>
              <p className="text-red-700 text-sm sm:text-base">
                No design or technical skills required. Our intuitive interface makes it simple for everyone.
              </p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="text-red-600 mb-3 sm:mb-4">
                <FaLightbulb className="text-2xl sm:text-3xl" />
              </div>
              <h4 className="text-lg font-semibold text-red-900 mb-2">Innovative Features</h4>
              <p className="text-red-700 text-sm sm:text-base">
                We continuously update our platform with new features based on user feedback.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-6 sm:mb-8 text-center">Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.slice(0, 2).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                position={testimonial.position}
                avatarColor={testimonial.avatarColor}
              />
            ))}
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <button className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base">
              View More Success Stories
            </button>
          </div>
        </div>
        
        {/* Values */}
        <div className="bg-red-50 rounded-xl p-6 sm:p-8 border border-red-200">
          <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-6 text-center">Our Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <FaCheck className="text-white text-xl" />, title: "Quality", desc: "We never compromise on the quality of our services." },
              { icon: <FaUsers className="text-white text-xl" />, title: "Community", desc: "We build tools that foster growth and collaboration." },
              { icon: <FaLightbulb className="text-white text-xl" />, title: "Innovation", desc: "We constantly explore new ideas and technologies." },
              { icon: <FaAward className="text-white text-xl" />, title: "Excellence", desc: "We strive for excellence in everything we do." }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {value.icon}
                </div>
                <h4 className="font-semibold text-red-900 mb-1 sm:mb-2">{value.title}</h4>
                <p className="text-red-700 text-xs sm:text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-3 sm:mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-red-700 text-sm sm:text-base mb-4 sm:mb-6 max-w-prose mx-auto">
            Join thousands of professionals already creating stunning documents with GenDocs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
