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

import { aiTemplates } from "../../utils/aiTemplates";
import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  addPersonalDetail,
  updatePersonalInfo,
  deletePersonalInfo,
} from "../../features/personalDetails/personalDetailsSlice";

import { generateCV } from "../../features/auth/authSlice";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";

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
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [currentSection] = useState<keyof typeof aiTemplates>("personal_information");
  // --- AI Workflow State ---
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [aiPreviewData, setAiPreviewData] = useState<any>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const { selectedPersonalDetail } = useSelector(
    (state: RootState) => state.personalDetails
  );

  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: existingDetails || {
      first_name:"",
      middle_name: "",
      last_name: "",
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

  // Apply AI form data when it changes


  // --- AI Handlers ---
  const handleOpenAI = () => {
    setAIModalOpen(true);
  };

  const handleGenerateFromAI = async (instructionText: string) => {
    if (!instructionText) return;

    setIsAILoading(true);
    try {
      // Build dynamic prompt using utility
      const prompt = buildAIPromptDynamic("personal_information", { instruction_text: instructionText });

      const payload = { section: "personal_information", userData: { prompt } };
      console.log("Dispatching AI Generation with payload:", payload);
      const resultAction = await dispatch(generateCV(payload));

      if (generateCV.fulfilled.match(resultAction)) {
        const generatedData = resultAction.payload;
        const parsedData = typeof generatedData === 'string' ? JSON.parse(generatedData) : generatedData;

        setAiPreviewData(parsedData);
        setAIModalOpen(false);
        setPreviewModalOpen(true);
      } else {
        console.error("AI Generation Failed:", resultAction.error);
      }
    } catch (error) {
      console.error("Error dispatching AI generation:", error);
    } finally {
      setIsAILoading(false);
    }
  };

  function convertToISODate(dateString: string): string {
    if (!dateString) return "";

    const parts = dateString.split(/[\/\-]/); // accept 11/08/2000 or 11-08-2000
    if (parts.length !== 3) return "";

    let [d, m, y] = parts;

    // If the AI returns MM/DD/YYYY, fix by swapping
    if (parseInt(d) <= 12 && parseInt(m) > 12) {
      [d, m] = [m, d];
    }

    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const handleAcceptAI = (rawData: any) => {
    if (!rawData) return;

    // Extract array from backend response
    const aiArray = rawData.personal_information ?? [];
    if (!Array.isArray(aiArray) || aiArray.length === 0) return;

    const aiData = aiArray[0]; // ✅ Take the first item

    const formData: Partial<FormFields> = {
      first_name: aiData.first_name ?? "",
      middle_name: aiData.middle_name ?? "",
      last_name: aiData.last_name ?? "",
      phone: aiData.phone ?? "",
      address: aiData.address ?? "",
      linkedin: aiData.linkedin ?? aiData.social_links?.linkedin ?? "",
      github: aiData.github ?? aiData.social_links?.github ?? "",
      website: aiData.website ?? aiData.social_links?.website ?? "",
      date_of_birth: convertToISODate(aiData.date_of_birth),
      nationality: aiData.nationality ?? "",
      profile_summary: aiData.profile_summary ?? "",
    };

    reset(formData, { keepErrors: true, keepDirty: false });
    setSuccessMessage("✅ Form populated with AI data. Please review and save.");
    setPreviewModalOpen(false);
    setAiPreviewData(null);
  };


  if (!user)
    return <p className="text-red-500 text-center mt-4">Not logged in</p>;

  const full_name = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");

  const createFormData = (data: FormFields) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("middle_name", data.middle_name || "");
    formData.append("last_name", data.last_name);
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
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(
        () => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)),
        100
      );

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
    <section className="relative mx-auto mt-6 p-6 border bg-background rounded-lg w-full shadow-lg">
      
      {/* 
        UPDATED HEADER: 
        1. Used 'flex-col' for mobile and 'md:flex-row' for larger screens.
        2. Added 'gap-4' for spacing between title and button.
        3. Made button 'w-full' on mobile and 'w-auto' on desktop.
      */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left w-full md:w-auto">
          {selectedPersonalDetail ? "Edit Personal Details" : "Fill Personal Details"}
        </h2>
        <Button
          type="button"
          label="✨ Autofill with AI"
          onClick={handleOpenAI}
          disabled={loading}
          className="w-full md:w-auto text-white text-sm px-4 py-2"
        />
      </div>

      <p className="text-gray-600 text-sm mb-6 text-center md:text-left">
        Fill in your personal information. This will be displayed in your CV/profile.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            type="text"
            label="First Name"
            placeholder="John"
            name="first_name"
            register={register("first_name")}
            error={errors.first_name?.message}
            disabled={loading}
            required
          />

          <InputField
            type="text"
            label="Middle Name (Optional)"
            placeholder="Michael"
            name="middle_name"
            register={register("middle_name")}
            error={errors.middle_name?.message}
            disabled={loading}
          />

          <InputField
            type="text"
            label="Last Name"
            placeholder="Doe"
            name="last_name"
            register={register("last_name")}
            error={errors.last_name?.message}
            disabled={loading}
            required
          />

          <InputField
            type="text"
            label="Phone Number"
            placeholder="+255 123 456 789"
            name="phone"
            register={register("phone")}
            error={errors.phone?.message}
            disabled={loading}
            required
          />

          <InputField
            type="text"
            label="Address"
            placeholder="123 Main St, City, Country"
            name="address"
            register={register("address")}
            error={errors.address?.message}
            disabled={loading}
            required
          />

          <InputField
            type="text"
            label="LinkedIn (Optional)"
            placeholder="https://www.linkedin.com/in/username"
            name="linkedin"
            register={register("linkedin")}
            error={errors.linkedin?.message}
            disabled={loading}
          />

          <InputField
            type="text"
            label="GitHub (Optional)"
            placeholder="https://github.com/username"
            name="github"
            register={register("github")}
            error={errors.github?.message}
            disabled={loading}
          />

          <InputField
            type="text"
            label="Website (Optional)"
            placeholder="https://www.example.com"
            name="website"
            register={register("website")}
            error={errors.website?.message}
            disabled={loading}
          />

          <InputField
            type="date"
            label="Date of Birth (Optional)"
            name="date_of_birth"
            register={register("date_of_birth")}
            error={errors.date_of_birth?.message}
            disabled={loading}
          />

          <InputField
            type="text"
            label="Nationality (Optional)"
            placeholder="Tanzanian"
            name="nationality"
            register={register("nationality")}
            error={errors.nationality?.message}
            disabled={loading}
          />

          <div className="md:col-span-2">
            <InputField
              type="text"
              label="Profile Summary (Optional)"
              placeholder="Brief description of yourself"
              name="profile_summary"
              register={register("profile_summary")}
              error={errors.profile_summary?.message}
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              type="file"
              label="Profile Image (Optional)"
              name="profile_image"
              register={register("profile_image")}
              error={errors.profile_image?.message as string | undefined}
              disabled={loading}
            />
          </div>
        </div>


        <div className="flex gap-4 flex-wrap mt-4 justify-center">
          {selectedPersonalDetail && <Button type="button" label="Delete" onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600 w-full md:w-auto" />}
          <Button type="submit" onClick={() => { }} label={selectedPersonalDetail ? "Update" : "Save Details"} disabled={loading} className="w-full md:w-auto" />
        </div>

        <Loader loading={loading} message={loading ? `Processing... (${elapsedTime}s elapsed)` : ""} />
      </form>

      {successMessage && <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">{successMessage}</div>}

      <AIInputModal
        isOpen={isAIModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={handleGenerateFromAI}
        loading={isAILoading}
        defaultText={aiTemplates[currentSection]}
        title={`Edit ${currentSection.replace("_", " ")}`}
        description="You can edit this text. AI will extract the info and fill the form."
        placeholder="Hi, my name is Sarah. I live in Arusha, Tanzania. Contact: 0655-999-888. Born on June 10, 1998. GitHub: github.com/sarah-codes."
        generateLabel="Generate Info"
        cancelLabel="Cancel"
      />

      <AIPreviewModal
        isOpen={isPreviewModalOpen}
        data={aiPreviewData}
        onClose={() => setPreviewModalOpen(false)}
        onAccept={handleAcceptAI}
        title="Review Extracted Personal Info"
        description="Confirm that the AI-extracted information is correct before filling the form."
        acceptLabel="Accept & Autofill"
        discardLabel="Discard"
      />
    </section>
  );
};

export default PersonDetailForm;