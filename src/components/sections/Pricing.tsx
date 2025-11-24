import React from "react";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  name: string;
  price: string;
  downloads: number;
  onBuy?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, downloads, onBuy }) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    if (onBuy) {
      return onBuy(); // use parent handler if provided
    }

    navigate("/payment", {
      state: { planName: name, price, downloads },
    });
  }; // ← FIXED: this closing brace was missing!!

  return (
    <div className="max-w-sm mx-auto border rounded-lg p-8 shadow-md bg-background border-redMain">
      <h2 className="text-2xl font-semibold mb-4 text-center text-primary">{name}</h2>

      <p className="text-center text-4xl font-extrabold mb-6 text-primary">
        {price} TZS
        <span className="text-lg font-normal text-subheading"> / pack</span>
      </p>

      <ul className="mb-8 space-y-3 text-subheading">
        <li className="flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-primary flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {downloads} CV downloads included
        </li>
      </ul>

      <button
        onClick={handleBuy}
        className="w-full py-3 rounded-lg font-semibold bg-redMain text-white hover:bg-red-600 transition-colors duration-300"
      >
        Buy Now
      </button>
    </div>
  );
};

export default PricingCard;
