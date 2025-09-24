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
    <div className="w-screen h-6 bg-red-100 border-b border-red-900 flex items-center gap-4 px-4 relative">
      <div
        className="text-red-700 text-sm hover:text-red-500 flex flex-row mx-4 cursor-pointer"
        onClick={toggleSignIn}
      >
        SIGN IN{" "}
        <span className="hover:text-2xl hover:text-red-600">
          <RiArrowDropDownLine />
        </span>
      </div>
      <div
        className="text-red-700 text-sm flex hover:text-red-500 flex-row cursor-pointer"
        onClick={toggleSignUp}
      >
        SIGN UP{" "}
        <span className="hover:text-2xl hover:text-red-600">
          <RiArrowDropDownLine />
        </span>
      </div>
      {signInIsOpen && <SignIn onClose={closeModals} />}
      {signUpIsOpen && <SignUp onClose={closeModals} />}
    </div>
  );
};

export default TopNav;

// ✅ SignIn with icon close
export const SignIn = ({ onClose }: { onClose: () => void }) => {
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
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await authService.login(dispatch, data);

      if (result.status === 200) {
        console.log("Login success:", result.data);
        // Show success notification / message
        setShowSuccess(true);
        // Optionally store token or update auth context here
      }
    } catch (error: any) {
      const backendMessage = error.message || "Login failed";
      console.error("Login error:", backendMessage);
      setErrorMsg(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl relative w-[90%] max-w-md min-h-[350px] mt-28 sm:mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <RiCloseLine
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer text-xl"
          onClick={onClose}
        />

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Login Successful
            </h2>
            <p className="text-gray-600">Welcome back! You are now logged in.</p>
            <button
              onClick={onClose}
              className="mt-6 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl uppercase font-semibold text-red-500 font-serif mt-4">
              Sig<span className="text-primary">n In</span>
            </h1>

            {errorMsg && (
              <div className="text-red-500 text-center mb-4">{errorMsg}</div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-full object-cover mt-4 p-4"
            >
              <InputField
                placeholder="email"
                name="email"
                type="email"
                register={register("email")}
                error={errors.email?.message}
              />
              <InputField
                placeholder="password"
                name="password"
                type="password"
                register={register("password")}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                name="submit"
                label="submit"
                className={`${active ? hoverStyle : ""}`}
                onClick={handleClickedSignIn}
              />

              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-2xl">
                  <ClipLoader color="#0f62fe" size={40} />
                </div>
              )}
            </form>
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

      // If backend sent structured error
      if (error?.response?.data) {
        const data = error.response.data;
        // If it's a dict (like DRF ValidationError)
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
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl relative w-[90%] max-w-md min-h-[400px] mt-28 sm:mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <RiCloseLine
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer text-xl"
          onClick={onClose}
        />

        {showEmailInstruction ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
            <FaEnvelopeOpenText className="text-red-500 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600">
              We’ve sent a verification link to your email address.
              <br />
              Please open your inbox and confirm your email to activate your account.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl uppercase font-semibold text-red-500 font-serif mt-4">
              Sig<span className="text-primary">n Up</span>
            </h1>

            {/* Backend error at the top */}
            {backendError && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center break-words">
                {backendError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-full mt-4 p-4 relative"
            >
              <InputField
                placeholder="Email"
                name="email"
                type="email"
                register={register("email")}
              />
              <InputField
                placeholder="First Name"
                name="first_name"
                type="text"
                register={register("first_name")}
              />
              <InputField
                placeholder="Middle Name"
                name="middle_name"
                type="text"
                register={register("middle_name")}
              />
              <InputField
                placeholder="Last Name"
                name="last_name"
                type="text"
                register={register("last_name")}
              />
              <InputField
                placeholder="Password"
                name="password"
                type="password"
                register={register("password")}
              />
              <InputField
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                register={register("confirmPassword")}
              />

              <Button
                type="submit"
                label="Submit"
                className={`${active ? hoverStyle : ""}`}
                onClick={handleClickedSignUp}
              />

              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-2xl">
                  <ClipLoader color="#0f62fe" size={40} />
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};
