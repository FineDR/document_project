import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export const Verification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  // ✅ Fix: move this inside the component
  const backendUrl = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:8000";


  useEffect(() => {
    if (token) {
      axios
        .get(`${backendUrl}/auth/verify-email/?token=${token}`)
        .then(() => setMessage("Email Verified Successfully!"))
        .catch((error) => {
          const err = error.response?.data?.error;
          if (err === "Activation link expired") {
            setMessage("Activation link expired. Please request a new one.");
          } else {
            setMessage("Verification failed. Invalid token.");
          }
        });
    } else {
      setMessage("No token provided.");
    }
  }, [token, backendUrl]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          {message}
        </h2>
        <a
          href="/"
          className="inline-block mt-4 bg-red-500 text-white px-6 py-2 rounded-full transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};
