import { useEffect } from "react";
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
import Loader from "../common/Loader"; // Reusable loader component
import { useTimedLoader } from "../../hooks/useTimedLoader"; // Handles minimum loader time

type FormFields = z.infer<typeof personalInformationSchema>;

interface Props {
  existingDetails?: FormFields;
  onDone?: () => void;
}

const PersonDetailForm = ({ existingDetails, onDone }: Props) => {
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

  const { loading, withLoader } = useTimedLoader(1500); // Minimum 1.5s loader

  useEffect(() => {
    if (existingDetails) reset(existingDetails);
  }, [existingDetails, reset]);

  if (!user) return <p>Not logged in</p>;

  const full_name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const payload = { ...data, full_name, email: user.email };
      try {
        if (existingDetails) {
          await updatePersonalDetails(payload);
        } else {
          await submitPersonalDetails(payload);
        }
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
    </div>
  );
};

export default PersonDetailForm;
