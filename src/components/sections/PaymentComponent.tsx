/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  processCheckout,
  resetPaymentState,
} from "../../features/payments/paymentsSlice";
import Button from "../formElements/Button";

interface PaymentComponentProps {
  onSuccess?: () => void; // optional callback for parent
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, checkoutData } = useSelector(
    (state: RootState) => state.payments
  );

  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [provider, setProvider] = useState("Mpesa");
  const [success, setSuccess] = useState(false);

  // ✅ Trigger success state when checkoutData is received
  useEffect(() => {
    if (checkoutData && !error) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(); // call parent success handler
      }, 1500);
    }
  }, [checkoutData, error, onSuccess]);

  const handleCheckout = () => {
    if (!accountNumber || !amount) return;
    dispatch(
      processCheckout({
        externalId: `TXN${Date.now()}`,
        accountNumber,
        amount,
        provider,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetPaymentState());
    setAccountNumber("");
    setAmount("");
    setProvider("Mpesa");
    setSuccess(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-50">
      <div className="max-w-md w-full mx-auto p-6 bg-whiteBg shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Make Payment
        </h2>

        {!success ? (
          <>
            {/* --- Provider Selection --- */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Provider
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="Mpesa">Mpesa</option>
                <option value="Airtel">Airtel</option>
                <option value="TigoPesa">Tigo Pesa</option>
                <option value="HaloPesa">Halo Pesa</option>
              </select>
            </div>

            {/* --- Account Input --- */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {/* --- Amount Input --- */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Amount (TZS)
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {/* --- Pay Button (Replaced with imported Button) --- */}
            <Button
              name="Pay Now"
              label={loading ? "Processing..." : "Pay Now"}
              type="button"
              onClick={handleCheckout}
              disabled={loading || !accountNumber || !amount}
              className={`w-full font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            />

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                {error}
              </div>
            )}
          </>
        ) : (
          /* --- Payment Success UI --- */
          <div className="text-center mt-6 animate-fade-in">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-4xl text-green-600">✓</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-green-700">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mt-1">
              Thank you for your payment. Redirecting...
            </p>

            {/* --- Reset Button --- */}
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
