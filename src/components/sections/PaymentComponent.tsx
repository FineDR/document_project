/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { processCheckout, resetPaymentState } from "../../features/payments/paymentsSlice";
import Button from "../formElements/Button";
import InputField from "../formElements/InputField";

interface PaymentComponentProps {
  onSuccess?: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, checkoutData } = useSelector((state: RootState) => state.payments);

  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [provider, setProvider] = useState("Mpesa");
  const [success, setSuccess] = useState(false);

  // Watch for checkout success
  useEffect(() => {
    if (checkoutData && checkoutData.success && !error) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    }
  }, [checkoutData, error, onSuccess]);

  const handleCheckout = () => {
    if (!accountNumber || !amount) return;

    const payload = {
      externalId: `TXN${Date.now()}`,
      accountNumber,
      amount,
      provider,
      callbackUrl: "https://precarnival-lourdes-podsollic.ngrok-free.de/api/payments/azampay/callback/",
      webhookUrl: "https://precarnival-lourdes-podsollic.ngrok-free.de/api/payments/webhook/"
    };


    dispatch(processCheckout(payload));
  };

  const handleReset = () => {
    dispatch(resetPaymentState());
    setAccountNumber("");
    setAmount("");
    setProvider("Mpesa");
    setSuccess(false);
  };

  const providerOptions = [
    { label: "Mpesa", value: "MPESA" },
    { label: "Airtel", value: "AIRTEL" },
    { label: "Tigo Pesa", value: "TIGO PESA" },
    { label: "Halo Pesa", value: "HALO PESA" },
  ];


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50">
      <div className="max-w-md w-full mx-auto p-6 bg-background text-text shadow-2xl rounded-2xl border border-subHeadingGray">
        <h2 className="text-2xl font-semibold mb-6 text-center text-primary">
          Make Payment
        </h2>

        {!success ? (
          <>
            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-subheading font-medium mb-1">Provider</label>
              <select
                className="w-full border rounded px-3 py-2 text-text bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                {providerOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <InputField
              name="accountNumber"
              type="text"
              label="Phone Number"
              placeholder="Enter your mobile number"
              value={accountNumber}
              onChange={setAccountNumber}
              required
            />

            {/* Amount */}
            <InputField
              name="amount"
              type="number"
              label="Amount (TZS)"
              placeholder="Enter amount"
              value={amount === "" ? "" : amount.toString()}
              onChange={(val) => setAmount(Number(val))}
              required
            />

            {/* Pay Button */}
            <Button
              name="Pay Now"
              label={loading ? "Processing..." : "Pay Now"}
              type="button"
              onClick={handleCheckout}
              disabled={loading || !accountNumber || !amount}
              className={`w-full font-semibold text-white ${loading ? "bg-subHeadingGray cursor-not-allowed" : "bg-primary hover:bg-redMain"
                }`}
            />

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-redMain text-sm">
                {error}
              </div>
            )}
          </>
        ) : (
          /* Payment Success */
          <div className="text-center mt-6 animate-fade-in">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-4xl text-green-600">✓</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
            <p className="text-subheading mt-1">Thank you for your payment. Redirecting...</p>

            <div className="mt-5">
              <Button
                name="Make Another Payment"
                label="Make Another Payment"
                type="button"
                onClick={handleReset}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentComponent;
