import { useState } from "react";
import PricingCard from "../components/sections/Pricing";

const Pricing = () => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      price: "0",
      features: ["Create up to 3 documents", "Basic templates", "Email support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "9.99",
      features: [
        "Unlimited documents",
        "Premium templates",
        "Priority email support",
        "Export to PDF & Word",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "29.99",
      features: [
        "Team collaboration",
        "Custom templates",
        "Dedicated support",
        "API access",
      ],
      popular: false,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Pricing Plans</h1>
      <p className="text-neutralText text-center max-w-xl mx-auto mb-12">
        Choose a plan that fits your document generation needs. Upgrade anytime.
      </p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            onMouseEnter={() => setHoveredPlan(plan.name)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <PricingCard plan={plan} isActive={hoveredPlan === plan.name} />
          </div>
        ))}
      </div>
    </main>
  );
};

export default Pricing;
