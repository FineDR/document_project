/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { loginUser, googleAuthUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";

interface GoogleUser {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
}

const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

export const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  type FormFields = z.infer<typeof loginSchema>;
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) return;
    try {
      await dispatch(googleAuthUser({ token })).unwrap();
      toast.success("Signed in successfully with Google!");
      window.location.href = "/profile"; // redirect after Google sign-in
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed.");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true); 
    setErrorMsg("");
    try {
      await dispatch(loginUser(data)).unwrap();
      setShowSuccess(true);
      setTimeout(() => (window.location.href = "/profile"), 2000);
    } catch (error: any) {
      setErrorMsg(error?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-96 bg-background text-text px-4">
      <div className="bg-background p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <FaCheckCircle className="text-green-500 text-6xl mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">Login Successful</h2>
            <p>Welcome back! Redirecting to your profile...</p>
          </div>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold mb-4">
              Sign <span className="text-primary">In</span>
            </h1>

            {errorMsg && (
              <div className="text-redMain text-center mb-4 text-sm bg-red-50 py-2 px-3 rounded-lg">
                {errorMsg}
              </div>
            )}

          {false && (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3 relative">
              <InputField placeholder="Email" name="email" type="email" register={register("email")} error={errors.email?.message}/>
              <InputField placeholder="Password" name="password" type="password" register={register("password")} error={errors.password?.message}/>
              <Button type="submit" label="Sign In" onClick={()=>{}} className="w-full"/>
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white/60 rounded-2xl">
                  <ClipLoader color="#0f62fe" size={40}/>
                </div>
              )}
            </form>
          )}

            <div className="flex flex-col items-center mt-6 space-y-3">
              <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>
              <p className="text-sm text-subheading">Continue with Google</p>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={()=>toast.error("Google sign-in failed")}/>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
