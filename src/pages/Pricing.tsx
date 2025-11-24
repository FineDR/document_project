import PricingCard from "../components/sections/Pricing";

const Pricing = () => {
  const handleBuy = () => {
    // TODO: integrate payment logic (AzamPay/Stripe) for 3 downloads
    alert("Proceed to payment for 3 downloads - 3000 TZS");
  };

  const plan = {
    name: "3 Downloads Pack",
    price: "3000",
    downloads: 3,
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-h1 font-bold text-redMain text-center mb-4">
        Pricing Plan
      </h1>
      <p className="text-subheading text-center max-w-xl mx-auto mb-12">
        Purchase a pack of 3 CV downloads for 3000 TZS. You can generate and download CVs instantly.
      </p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-1">
        <PricingCard
          name={plan.name}
          price={plan.price}
          downloads={plan.downloads}
          onBuy={handleBuy}
        />
      </div>
    </main>
  );
};

export default Pricing;
