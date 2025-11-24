/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import SelectInputField from "../formElements/SelectInputField";
import Button from "../formElements/Button";
import { languagesSchema } from "../forms/cvValidationSchema";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import type { z } from "zod";

import { addLanguage, updateLanguageById } from "../../features/languages/languagesSlice";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { aiTemplates } from "../../utils/aiTemplates";
import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { generateCV } from "../../features/auth/authSlice";

type FormFields = z.infer<typeof languagesSchema>;

interface Props {
  editingLanguage?: { id: number; language: string; proficiency: string };
  onDone?: () => void;
}

const proficiencyOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Fluent", value: "Fluent" },
  { label: "Native", value: "Native" },
];

const LanguagesFormDetails: React.FC<Props> = ({ editingLanguage, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { loading, withLoader } = useTimedLoader(3000);

  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  // AI States
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<any>(null);
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("languages");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(languagesSchema),
    defaultValues: { languages: [{ language: "", proficiency: "" }] },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "languages",
  });

  // Reset when editing single item
  useEffect(() => {
    if (editingLanguage) {
      replace([{ language: editingLanguage.language, proficiency: editingLanguage.proficiency }]);
    } else {
      reset({ languages: [{ language: "", proficiency: "" }] });
    }
  }, [editingLanguage, replace, reset]);

  if (!user) return <p className="text-red-500">Not logged in</p>;

  /* --------------------------------------------------------
      SUBMIT HANDLER
  -------------------------------------------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);

      const interval = setInterval(
        () => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)),
        100
      );

      try {
        let message = "";

        if (editingLanguage) {
          await dispatch(
            updateLanguageById({ id: editingLanguage.id, data: data.languages[0] })
          ).unwrap();

          message = "✅ Language updated successfully.";
        } else {
          await Promise.all(
            data.languages.map((lang) => dispatch(addLanguage(lang)).unwrap())
          );

          message = "✅ Languages submitted successfully.";
        }

        reset({ languages: [{ language: "", proficiency: "" }] });
        setSuccessMessage(message);
        onDone?.();
      } catch (error) {
        console.error("Error submitting languages:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  const handleGenerateFromAI = async (instructionText: string) => {
    if (!instructionText) return;

    setAILoading(true);
    try {
      const prompt = buildAIPromptDynamic("languages", { instruction_text: instructionText });
      const payload = { section: "languages", userData: { prompt } };

      const resultAction = await dispatch(generateCV(payload));

      if (generateCV.fulfilled.match(resultAction)) {
        const generatedData = resultAction.payload;

        const parsedData =
          typeof generatedData === "string" ? JSON.parse(generatedData) : generatedData;

        // --- FIXED: Use the array from AI response ---
        const languagesArray: { language: string; proficiency: string }[] =
          Array.isArray(parsedData.languages) ? parsedData.languages.map((item: any) => ({
            language: item.language || "",
            proficiency: mapFluency(item.proficiency || ""),
          })) : [];

        setAIData(languagesArray);
        setAIModalOpen(false);
        setPreviewOpen(true);
      } else {
        console.error("AI Generation Failed:", resultAction.error);
      }
    } catch (error) {
      console.error("Error dispatching AI generation:", error);
    } finally {
      setAILoading(false);
    }
  };


  const handleAcceptAI = () => {
    if (!aiData || !Array.isArray(aiData)) return;

    replace(aiData); // replace current form array with AI data
    setPreviewOpen(false);
  };

  // Simple mapping from AI fluency text to your select options
  const mapFluency = (text: string) => {
    if (!text) return "";
    const t = text.toLowerCase();
    if (t.includes("beginner") || t.includes("basic")) return "Beginner";
    if (t.includes("intermediate")) return "Intermediate";
    if (t.includes("fluent")) return "Fluent";
    if (t.includes("native")) return "Native";
    return "Intermediate"; // fallback
  };


  /* --------------------------------------------------------
      UI RETURN
  -------------------------------------------------------- */
  return (
    <section className="w-full mx-auto p-6 bg-whiteBg border rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {editingLanguage ? "Edit Language" : "Add Language"}
      </h2>

      <p className="text-gray-600 text-sm mb-6 text-center">
        Add the languages you know and indicate your proficiency level.
      </p>

      {/* AI Button */}
      {!editingLanguage && (
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            label="✨ AutoFill with AI"
            onClick={() => setAIModalOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 space-y-4 relative">

            <InputField
              type="text"
              label="Language *"
              placeholder="e.g., English, Swahili, French"
              name={`languages.${index}.language`}
              register={register(`languages.${index}.language` as const)}
              error={errors.languages?.[index]?.language?.message}
              disabled={loading}
            />

            <p className="text-gray-400 text-xs italic mt-1">
              Enter the name of the language you are proficient in.
            </p>

            <SelectInputField<FormFields>
              label="Proficiency *"
              name={`languages.${index}.proficiency`}
              register={register}
              options={proficiencyOptions}
              error={errors.languages?.[index]?.proficiency}
              disabled={loading}
            />

            <p className="text-gray-400 text-xs italic mt-1">
              Choose your proficiency level in this language.
            </p>

            {fields.length > 1 && !editingLanguage && (
              <Button
                type="button"
                label="Remove"
                onClick={() => remove(index)}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              />
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-3 justify-start">
          {!editingLanguage && (
            <Button
              type="button"
              label="+ Add Language"
              onClick={() => append({ language: "", proficiency: "" })}
              disabled={loading}
              className="mx-4"
            />
          )}

          <Button
            type="submit"
            onClick={() => { }}
            label={editingLanguage ? "Update" : "Submit"}
            disabled={loading}
          />
        </div>

        <Loader
          loading={loading}
          message={
            loading ? `Processing languages... (${elapsedTime}s elapsed)` : ""
          }
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
          {successMessage}
        </div>
      )}

      {/* --- AI Modals --- */}
      <AIInputModal
        isOpen={isAIModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={handleGenerateFromAI}
        loading={isAILoading}
        defaultText={aiTemplates[currentSection]} // <-- template for that section
        title={`Edit ${currentSection.replace("_", " ")}`}
        description="You can edit this text. AI will extract the info and fill the form."
        placeholder="Example: I speak English fluently, Swahili natively, and I have basic understanding of French."
        generateLabel="Generate Languages"
        cancelLabel="Cancel"
      />

      <AIPreviewModal
        isOpen={isPreviewOpen}
        data={aiData}
        onClose={() => setPreviewOpen(false)}
        onAccept={handleAcceptAI}
        title="Review Extracted Languages"
        description="AI extracted the languages and proficiency levels below. Confirm to autofill."
        acceptLabel="Accept & Autofill"
        discardLabel="Discard"
      />

    </section>
  );
};

export default LanguagesFormDetails;
