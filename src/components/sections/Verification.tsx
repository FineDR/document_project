import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import Button from "../formElements/Button"; // Assuming you have a Button component

export const Verification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  const backendUrl = import.meta.env.VITE_APP_API_BASE_URL;

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
    <div className="flex justify-center items-center min-h-screen bg-redBg px-4 font-sans">
      <div className="bg-whiteBg shadow-lg rounded-xl p-8 max-w-md text-center">
        <FaCheckCircle className="text-redMain text-5xl mx-auto mb-4" />
        <h2 className="text-h2 font-semibold mb-2 text-subHeadingGray">{message}</h2>
        <Button
          type="button"
          label="Go to Login"
          onClick={() => (window.location.href = "/")}
          className="mt-4 bg-redMain text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all font-medium"
        />
      </div>
    </div>
  );
};
