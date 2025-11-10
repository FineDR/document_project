/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { registerUser, googleAuthUser } from "../../features/auth/authSlice";
import ClipLoader from "react-spinners/ClipLoader";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";

const signUpSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().nonempty("Confirm Password is required").min(6, "Password must be at least 6 characters"),
  first_name: z.string().nonempty("First name is required"),
  middle_name: z.string().nonempty("Middle name is required"),
  last_name: z.string().nonempty("Last name is required"),
});

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  type FormFields = z.infer<typeof signUpSchema>;

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(signUpSchema),
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) return toast.error("Google authentication failed");

    try {
      await dispatch(googleAuthUser({ token })).unwrap();
      toast.success("Signed up successfully with Google!");
      window.location.href = "/profile";
    } catch (err: any) {
      toast.error(err.message || "Google signup failed");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    setErrorMsg("");
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const fullName = `${data.first_name} ${data.middle_name} ${data.last_name}`.trim();
      await dispatch(registerUser({ name: fullName, email: data.email, password: data.password })).unwrap();
      setShowSuccess(true);
      reset();
      setTimeout(() => (window.location.href = "/profile"), 2000);
    } catch (err: any) {
      setErrorMsg(err?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-text px-4">
      <div className="bg-background p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <p className="text-green-500 text-6xl mb-4">🎉</p>
            <h2 className="text-2xl font-semibold mb-2">Registration Successful</h2>
            <p>Welcome! Redirecting to your profile...</p>
          </div>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold mb-4">
              Sign <span className="text-primary">Up</span>
            </h1>

            {errorMsg && (
              <div className="text-redMain text-center mb-4 text-sm bg-red-50 py-2 px-3 rounded-lg">
                {errorMsg}
              </div>
            )}
            {false && (

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3 relative">
              <InputField placeholder="Email" name="email" type="email" register={register("email")} error={errors.email?.message} />
              <InputField placeholder="First Name" name="first_name" type="text" register={register("first_name")} error={errors.first_name?.message} />
              <InputField placeholder="Middle Name" name="middle_name" type="text" register={register("middle_name")} error={errors.middle_name?.message} />
              <InputField placeholder="Last Name" name="last_name" type="text" register={register("last_name")} error={errors.last_name?.message} />
              <InputField placeholder="Password" name="password" type="password" register={register("password")} error={errors.password?.message} />
              <InputField placeholder="Confirm Password" name="confirmPassword" type="password" register={register("confirmPassword")} error={errors.confirmPassword?.message} />
              <Button type="submit" label="Sign Up" onClick={() => {}} className="w-full" />
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white/60 rounded-2xl">
                  <ClipLoader color="#0f62fe" size={40} />
                </div>
              )}
            </form>
            )}

            <div className="flex flex-col items-center mt-6 space-y-3">
              <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>
              <p className="text-sm text-subheading">Continue with Google</p>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google signup failed")} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
