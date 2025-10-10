import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { personalInformationSchema } from "../forms/cvValidationSchema";
import {
  submitPersonalDetails,
  updatePersonalDetails,
  deletePersonalDetails,
} from "../../api/personalDetails";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

type FormFields = z.infer<typeof personalInformationSchema>;

interface Props {
  existingDetails?: FormFields;
  onDone?: () => void;
}

const PersonDetailForm = ({ existingDetails, onDone }: Props) => {
  const [successMessage, setSuccessMessage] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: existingDetails || {
      phone: "",
      address: "",
      linkedin: "",
      github: "",
      website: "",
      date_of_birth: "",
      nationality: "",
      profile_summary: "",
    },
  });

  const { loading, withLoader } = useTimedLoader(1500);

  useEffect(() => {
    if (existingDetails) reset(existingDetails);
  }, [existingDetails, reset]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p>Not logged in</p>;

  const full_name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const payload = { ...data, full_name, email: user.email };
      try {
        let message = "";
        if (existingDetails) {
          await updatePersonalDetails(payload);
          message = "✅ Your personal details have been updated successfully.";
        } else {
          await submitPersonalDetails(payload);
          message = "✅ Your personal details have been saved successfully.";
        }
        reset({
          phone: "",
          address: "",
          linkedin: "",
          github: "",
          website: "",
          date_of_birth: "",
          nationality: "",
          profile_summary: "",
        });
        setSuccessMessage(message);
        onDone?.();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    });
  };

  const handleDelete = async () => {
    await withLoader(async () => {
      try {
        await deletePersonalDetails();
        onDone?.();
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    });
  };

  return (
    <div className="border p-4 rounded-lg bg-white m-4 relative">
      <h2 className="text-center text-primary text-2xl font-semibold">
        {existingDetails ? "Edit Personal Details" : "Fill Personal Details"}
      </h2>

      {/* User guidance */}
      <p className="text-gray-600 text-sm text-center mt-2">
        Please fill in your personal information accurately. This information
        will be used in your CV/profile.
      </p>

      <div className="relative mt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 m-8 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              type="text"
              label="Phone Number *"
              placeholder="e.g., +255 123 456 789"
              name="phone"
              register={register("phone")}
              error={errors.phone?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Address *"
              placeholder="e.g., 123 Main St, City, Country"
              name="address"
              register={register("address")}
              error={errors.address?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="LinkedIn Profile *"
              placeholder="e.g., linkedin.com/in/finesawa"
              name="linkedin"
              register={register("linkedin")}
              error={errors.linkedin?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="GitHub Profile *"
              placeholder="e.g., github.com/FineSawa"
              name="github"
              register={register("github")}
              error={errors.github?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Website *"
              placeholder="e.g., www.design.com"
              name="website"
              register={register("website")}
              error={errors.website?.message}
              disabled={loading}
            />
            <InputField
              type="date"
              label="Date of Birth *"
              name="date_of_birth"
              register={register("date_of_birth")}
              error={errors.date_of_birth?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Nationality *"
              placeholder="e.g., Tanzanian"
              name="nationality"
              register={register("nationality")}
              error={errors.nationality?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Profile Summary *"
              placeholder="e.g., A brief summary about yourself"
              name="profile_summary"
              register={register("profile_summary")}
              error={errors.profile_summary?.message}
              disabled={loading}
            />
            {/* Inline tip for profile summary */}
            <p className="text-gray-500 text-xs col-span-full">
              Tip: Keep your profile summary concise (2-3 sentences) and highlight
              your main skills and career goal.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap mx-4">
            {existingDetails && (
              <Button
                type="button"
                label="Delete"
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              />
            )}
            <Button
              type="submit"
              label={existingDetails ? "Update" : "Submit"}
              onClick={() => {}}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            />
          </div>

          <Loader
            loading={loading}
            message={
              existingDetails ? "Updating details..." : "Saving your details..."
            }
          />
        </form>
      </div>
      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default PersonDetailForm;
