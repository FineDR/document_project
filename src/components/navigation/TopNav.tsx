/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { RiArrowDropDownLine, RiCloseLine } from "react-icons/ri"; // import close icon
import InputField from "../formElements/InputField";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ClipLoader from "react-spinners/ClipLoader";
import { authService } from "../../api/authService";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../formElements/Button";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { loginUser, googleAuthUser } from "../../features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "../common/ThemeToggle";


interface GoogleUser {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
}

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignUpSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .nonempty("Confirm Password is required")
    .min(6, "Confirm Password must be at least 6 characters"),
  first_name: z.string().nonempty("First name is required"),
  middle_name: z.string().nonempty("Middle name is required"),
  last_name: z.string().nonempty("Last name is required"),
});

const TopNav = () => {
  const [signInIsOpen, setSignIn] = useState(false);
  const [signUpIsOpen, setSignUp] = useState(false);

  const toggleSignIn = () => {
    setSignIn(!signInIsOpen);
    setSignUp(false);
  };

  const toggleSignUp = () => {
    setSignUp(!signUpIsOpen);
    setSignIn(false);
  };

  const closeModals = () => {
    setSignIn(false);
    setSignUp(false);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-background/50 dark:bg-bg backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center h-12 px-4">

          {/* SIGN IN / SIGN UP */}
          <div className="flex items-center gap-4 mx-4">
            <div
              className="text-primary lowercase text-base font-bold hover:text-redMain flex items-center cursor-pointer transition-colors"
              onClick={toggleSignIn}
            >
              sign in
              <RiArrowDropDownLine className="ml-1 text-2xl" />
            </div>
            <div
              className="text-primary lowercase text-base font-bold hover:text-redMain flex items-center cursor-pointer transition-colors"
              onClick={toggleSignUp}
            >
              sign up
              <RiArrowDropDownLine className="ml-1 text-2xl" />
            </div>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

        </div>
      </div>

      {/* Modals */}
      {signInIsOpen && <SignIn onClose={closeModals} />}
      {signUpIsOpen && <SignUp onClose={closeModals} />}
    </div>

  );
};

export default TopNav;


// ✅ SignIn with icon close
export const SignIn = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  type FormFields = z.infer<typeof loginSchema>;
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";
  const handleClickedSignIn = () => {
    setActive(!active);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },

  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) return;

    try {
      const user = jwtDecode<GoogleUser>(token);
      const payload = {
        email: user.email,
        first_name: user.given_name,
        last_name: user.family_name,
        googleId: user.sub,
      };

      console.log("Google SignUp Payload:", payload);
      const resultAction = await dispatch(
        googleAuthUser({ token })
      );

      if (googleAuthUser.fulfilled.match(resultAction)) {
        toast.success("Signed up successfully with Google!");
        onClose();
      } else {
        throw new Error((resultAction.payload as string) || "Google signup failed");
      }
    } catch (err: any) {
      console.error("Google signup error:", err);
      toast.error(err.message || "Google signup failed. Try again.");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setFieldErrors({});
    try {
      const resultAction = await dispatch(loginUser(data));
      const result = unwrapResult(resultAction);
      console.log("Login success:", result);

      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
      // Optionally store token or update auth context here
    } catch (error: any) {
      if (error && typeof error === "object") {
        const newFieldErrors: Record<string, string> = {};

        Object.keys(error).forEach((key) => {
          if (Array.isArray(error[key]) && error[key].length > 0) {
            newFieldErrors[key] = error[key][0];
          }
        });

        setFieldErrors(newFieldErrors);

        if (newFieldErrors.non_field_errors) {
          setErrorMsg(newFieldErrors.non_field_errors);
        }
      } else {
        setErrorMsg(error || "Login failed");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-background text-text p-8 rounded-2xl shadow-2xl relative w-[90%] max-w-md min-h-[420px] sm:min-h-[380px] transition-all duration-300 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <RiCloseLine
          className="absolute top-4 right-4 text-subheading hover:text-redMain cursor-pointer text-2xl transition-colors"
          onClick={onClose}
        />

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold text-text mb-2">
              Login Successful
            </h2>
            <p className="text-subheading text-sm">
              Welcome back! You are now logged in.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-redMain text-white px-6 py-2 rounded-full hover:opacity-90 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <h1 className="text-center text-3xl font-bold text-text font-serif mb-2">
              Sign <span className="text-primary">In</span>
            </h1>
            <p className="text-center text-subheading mb-6 text-sm">
              Access your account easily using Google
            </p>

            {/* Error message */}
            {errorMsg && (
              <div className="text-redMain text-center mb-4 text-sm bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Hidden Manual Form */}
            {false && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full h-full object-cover mt-4 p-4"
              >
                <InputField
                  placeholder="Email"
                  name="email"
                  type="email"
                  register={register("email")}
                  error={fieldErrors.email || errors.email?.message}
                />
                <InputField
                  placeholder="Password"
                  name="password"
                  type="password"
                  register={register("password")}
                  error={fieldErrors.password || errors.password?.message}
                />
                <Button
                  type="submit"
                  name="submit"
                  label="Submit"
                  className={`w-full ${active ? hoverStyle : ""}`}
                  onClick={handleClickedSignIn}
                />

                {loading && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex justify-center items-center rounded-2xl">
                    <ClipLoader color="#0f62fe" size={40} />
                  </div>
                )}
              </form>
            )}

            {/* Google Login Section */}
            <div className="flex flex-col items-center mt-6 space-y-3">
              <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>
              <p className="text-subheading text-sm">Continue with Google</p>
              <div className="scale-105 hover:scale-110 transition-transform duration-200">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    toast.error("Google sign-in failed. Try again.")
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>


  );
};

// ✅ SignUp with icon close








export const SignUp = ({ onClose }: { onClose: () => void }) => {
  type FormFields = z.infer<typeof SignUpSchema>;

  const [loading, setLoading] = useState(false);
  const [showEmailInstruction, setShowEmailInstruction] = useState(false);
  const [active, setActive] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const hoverStyle = "hover:bg-red-500/60";

  const handleClickedSignUp = () => setActive(!active);

  const { register, handleSubmit, reset } = useForm<FormFields>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) return;

    try {
      const user = jwtDecode<GoogleUser>(token);
      const payload = {
        email: user.email,
        first_name: user.given_name,
        last_name: user.family_name,
        googleId: user.sub,
      };

      console.log("Google SignUp Payload:", payload);
      const resultAction = await dispatch(
        googleAuthUser({ token })
      );

      if (googleAuthUser.fulfilled.match(resultAction)) {
        toast.success("Signed up successfully with Google!");
        onClose();
      } else {
        throw new Error((resultAction.payload as string) || "Google signup failed");
      }
    } catch (err: any) {
      console.error("Google signup error:", err);
      toast.error(err.message || "Google signup failed. Try again.");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    setBackendError(null);

    try {
      const result = await authService.signUp(dispatch, data);

      if (result.status === 200 || result.status === 201) {
        setShowEmailInstruction(true);
        reset();
      }
    } catch (error: any) {
      let messages = "Signup failed. Please try again.";

      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "object") {
          messages = Object.entries(data)
            .map(([field, val]) =>
              Array.isArray(val) ? `${field}: ${val.join(" ")}` : `${field}: ${val}`
            )
            .join(" | ");
        } else if (typeof data === "string") {
          messages = data;
        }
      } else if (typeof error?.message === "string") {
        messages = error.message;
      }

      setBackendError(messages);
      toast.error(messages, { position: "top-right", autoClose: 5000 });
      console.error("❌ Signup error:", messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-background text-text p-8 rounded-2xl shadow-2xl relative w-[90%] max-w-md min-h-[420px] sm:min-h-[380px] transition-all duration-300 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <RiCloseLine
          className="absolute top-4 right-4 text-subheading hover:text-redMain cursor-pointer text-2xl transition-colors"
          onClick={onClose}
        />

        {showEmailInstruction ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
            <FaEnvelopeOpenText className="text-redMain text-6xl mb-4 animate-bounce" />
            <h2 className="text-2xl font-semibold text-text mb-2">
              Check Your Email
            </h2>
            <p className="text-subheading text-sm">
              We’ve sent a verification link to your email address.<br />
              Please open your inbox and confirm your email to activate your account.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-redMain text-white px-6 py-2 rounded-full hover:brightness-110 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <h1 className="text-center text-3xl font-bold text-text font-serif mb-2">
              Sign <span className="text-primary">Up</span>
            </h1>
            <p className="text-center text-subheading mb-6 text-sm">
              Access your account easily using Google
            </p>

            {/* Error message */}
            {backendError && (
              <div className="bg-red-100 text-redMain dark:bg-red-900/20 p-2 rounded mb-3 text-center break-words text-sm">
                {backendError}
              </div>
            )}

            {/* Manual Form Hidden */}
            {false && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full h-full mt-4 p-4 relative"
              >
                <InputField placeholder="Email" name="email" type="email" register={register("email")} />
                <InputField placeholder="First Name" name="first_name" type="text" register={register("first_name")} />
                <InputField placeholder="Middle Name" name="middle_name" type="text" register={register("middle_name")} />
                <InputField placeholder="Last Name" name="last_name" type="text" register={register("last_name")} />
                <InputField placeholder="Password" name="password" type="password" register={register("password")} />
                <InputField placeholder="Confirm Password" name="confirmPassword" type="password" register={register("confirmPassword")} />

                <Button
                  type="submit"
                  label="Submit"
                  className={`w-full ${active ? hoverStyle : ""}`}
                  onClick={handleClickedSignUp}
                />

                {loading && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 flex justify-center items-center rounded-2xl">
                    <ClipLoader color="#0f62fe" size={40} />
                  </div>
                )}
              </form>
            )}

            {/* Google Sign-Up Section */}
            <div className="flex flex-col items-center mt-6 space-y-3">
              <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>
              <p className="text-subheading text-sm font-medium tracking-wide">
                Continue with Google
              </p>
              <div className="scale-105 hover:scale-110 transition-transform duration-200">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  text="signup_with"
                  onError={() => toast.error("Google signup failed. Try again.")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>

  );
};

