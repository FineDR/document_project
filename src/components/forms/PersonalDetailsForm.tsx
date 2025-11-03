/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { personalInformationSchema } from "../forms/cvValidationSchema";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  addPersonalDetail,
  updatePersonalInfo,
  deletePersonalInfo,
} from "../../features/personalDetails/personalDetailsSlice";

type FormFields = z.infer<typeof personalInformationSchema> & {
  profile_image?: FileList;
};

interface Props {
  existingDetails?: FormFields;
  onDone?: () => void;
}

const PersonDetailForm: React.FC<Props> = ({ existingDetails, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, withLoader } = useTimedLoader(3000);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const user = useSelector((state: RootState) => state.auth.user);
  const { selectedPersonalDetail } = useSelector((state: RootState) => state.personalDetails);

  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormFields>({
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
      profile_image: undefined,
    },
  });

  useEffect(() => {
    if (existingDetails) reset(existingDetails);
    else if (selectedPersonalDetail) reset(selectedPersonalDetail);
  }, [existingDetails, selectedPersonalDetail, reset]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p className="text-red-500 text-center">Not logged in</p>;

  const full_name = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");

  const createFormData = (data: FormFields) => {
    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", user.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address || "");
    formData.append("linkedin", data.linkedin || "");
    formData.append("github", data.github || "");
    formData.append("website", data.website || "");
    formData.append("date_of_birth", data.date_of_birth || "");
    formData.append("nationality", data.nationality || "");
    formData.append("profile_summary", data.profile_summary || "");
    if (data.profile_image && data.profile_image.length > 0) {
      formData.append("profile_image", data.profile_image[0]);
    }
    return formData;
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      setElapsedTime(0);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        const formData = createFormData(data);

        if (selectedPersonalDetail) {
          await dispatch(updatePersonalInfo(formData)).unwrap();
          setSuccessMessage("✅ Personal details updated successfully.");
        } else {
          await dispatch(addPersonalDetail(formData)).unwrap();
          setSuccessMessage("✅ Personal details saved successfully.");
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
          profile_image: undefined,
        });
        onDone?.();
      } catch (error) {
        console.error("Error submitting personal details:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  const handleDelete = async () => {
    await withLoader(async () => {
      try {
        await dispatch(deletePersonalInfo()).unwrap();
        setSuccessMessage("🗑️ Personal details deleted successfully.");
        reset();
        onDone?.();
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    });
  };

  return (
    <section className="relative mx-auto mt-6 p-6 border bg-whiteBg rounded-lg w-full">
      <h2 className="text-center text-2xl font-semibold mb-4">
        {selectedPersonalDetail ? "Edit Personal Details" : "Fill Personal Details"}
      </h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Please fill in your personal information accurately. This will be used in your CV/profile.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <InputField
              type="text"
              label="Phone Number *"
              placeholder="e.g., +255 123 456 789"
              name="phone"
              register={register("phone")}
              error={errors.phone?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Enter your primary phone number with country code.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="Address *"
              placeholder="e.g., 123 Main St, City, Country"
              name="address"
              register={register("address")}
              error={errors.address?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Your current residential address.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="LinkedIn Profile *"
              placeholder="e.g., linkedin.com/in/finesawa"
              name="linkedin"
              register={register("linkedin")}
              error={errors.linkedin?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Your professional LinkedIn profile URL.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="GitHub Profile *"
              placeholder="e.g., github.com/FineSawa"
              name="github"
              register={register("github")}
              error={errors.github?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Your GitHub profile URL.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="Website *"
              placeholder="e.g., www.design.com"
              name="website"
              register={register("website")}
              error={errors.website?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Personal or portfolio website URL.
            </p>
          </div>

          <div>
            <InputField
              type="date"
              label="Date of Birth *"
              name="date_of_birth"
              register={register("date_of_birth")}
              error={errors.date_of_birth?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Your birth date.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="Nationality *"
              placeholder="e.g., Tanzanian"
              name="nationality"
              register={register("nationality")}
              error={errors.nationality?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Your country of citizenship.
            </p>
          </div>

          <div>
            <InputField
              type="text"
              label="Profile Summary *"
              placeholder="Briefly describe yourself"
              name="profile_summary"
              register={register("profile_summary")}
              error={errors.profile_summary?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              A short description of your professional background.
            </p>
          </div>

          <div>
            <InputField
              type="file"
              label="Profile Image"
              name="profile_image"
              register={register("profile_image")}
              error={errors.profile_image?.message as string | undefined}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Optional: Upload a profile picture.
            </p>
          </div>

        </div>

        <div className="flex gap-4 flex-wrap mt-4">
          {selectedPersonalDetail && (
            <Button
              type="button"
              label="Delete"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            />
          )}
          <Button
            type="submit"
            label={selectedPersonalDetail ? "Update" : "Submit"}
            onClick={() => {}}
            disabled={loading}
          />
        </div>

        <Loader
          loading={loading}
          message={loading ? `Processing... (${elapsedTime}s elapsed)` : ""}
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
          {successMessage}
        </div>
      )}
    </section>
  );
};

export default PersonDetailForm;
