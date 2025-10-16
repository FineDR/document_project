// src/components/pricing/PricingCard.tsx
import React from "react";

type PricingPlan = {
  name: string;
  price: string;
  features: string[];
  popular: boolean; // still in the data but not used for styling
};

interface PricingCardProps {
  plan: PricingPlan;
  isActive?: boolean; // only this controls the red theme
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isActive = false }) => {
  return (
    <div
      className={`border rounded-lg p-8 flex flex-col shadow-md transition-all duration-300 transform
        ${isActive ? "border-red-500 bg-red-50 scale-105 ring-2 ring-red-400 z-10" : "border-gray-300 bg-whiteBg"}
      `}
    >
      <h2 className={`text-2xl font-semibold mb-4 text-center ${isActive ? "text-red-600" : "text-black"}`}>
        {plan.name}
      </h2>
      <p className={`text-center text-4xl font-extrabold mb-6 ${isActive ? "text-red-600" : "text-primary"}`}>
        ${plan.price}
        <span className="text-lg font-normal text-neutralText"> / month</span>
      </p>

      <ul className="mb-8 space-y-3 text-gray-700 flex-grow">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center">
            <svg
              className={`w-6 h-6 mr-2 flex-shrink-0 ${isActive ? "text-red-500" : "text-primary"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300
          ${isActive
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-primary text-white hover:bg-primary-light"}
        `}
      >
        {plan.popular ? "Get Started" : "Choose Plan"}
      </button>
    </div>
  );
};

export default PricingCard;
