/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerObjectiveSchema } from "./cvValidationSchema";
import type { CareerObjective } from "../../types/cv/cv";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";
import Button from "../formElements/Button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addCareerObjective, updateCareerObjectiveById } from "../../features/carerobjectives/carerObjectivesSlice";
import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import z from "zod";
import { generateCV } from "../../features/auth/authSlice";
import { aiTemplates } from "../../utils/aiTemplates";
type FormFields = z.infer<typeof careerObjectiveSchema>;

interface Props {
  editingObjective?: CareerObjective;
  editingIndex?: number;
  onDone: (updated: CareerObjective) => void;
}

const CareerObjectiveFormDetails = ({ editingObjective, editingIndex, onDone }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: reduxLoading, error } = useSelector((state: RootState) => state.carerObjectives);
  const { loading: timedLoading, withLoader } = useTimedLoader(1500);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<string>("");
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("career_objective");
  const isLoading = reduxLoading || timedLoading;

  const defaultObjective = useMemo<Partial<CareerObjective>>(
    () => editingObjective || { career_objective: "" },
    [editingObjective]
  );

  const methods = useForm<FormFields>({
    resolver: zodResolver(careerObjectiveSchema),
    defaultValues: { career_objective: defaultObjective.career_objective || "" },
  });

  const { register, handleSubmit, reset, formState: { errors } } = methods;

  useEffect(() => {
    reset({ career_objective: defaultObjective.career_objective || "" });
  }, [defaultObjective.career_objective, reset]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 100);
    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      try {
        let updatedObjective: CareerObjective;
        let message = "";

        if (editingObjective?.id && editingIndex !== undefined) {
          updatedObjective = await dispatch(
            updateCareerObjectiveById({
              id: editingObjective.id,
              data: { career_objective: data.career_objective },
            })
          ).unwrap();
          message = "Career objective updated successfully ✅";
        } else {
          updatedObjective = await dispatch(
            addCareerObjective({ career_objective: data.career_objective })
          ).unwrap();
          message = "Career objective saved successfully ✅";
        }

        reset({ career_objective: "" });
        setSuccessMessage(message);
        onDone(updatedObjective);
      } catch (err) {
        console.error("Error saving career objective:", err);
      }
    });
  };

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  // --- AI Handler for Career Objective ---
  const handleGenerateCareerObjectiveFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      // Build dynamic prompt for career objective section
      const prompt = buildAIPromptDynamic("career_objective", { instruction_text: instructionText });

      // Dispatch the thunk with correct userData key
      const resultAction = await dispatch(
        generateCV({ section: "career_objective", userData: { instruction_text: prompt } })
      );

      if (generateCV.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        // Backend returns either { items: [{ career_objective: ... }] } or single object
        let objective = "";
        if (payload.items && Array.isArray(payload.items) && payload.items.length > 0) {
          objective = payload.items[0].career_objective ?? "";
        } else if (payload.career_objective) {
          objective = payload.career_objective;
        }

        setAIData(objective); // preview modal shows the extracted text
        setAIModalOpen(false);
        setPreviewOpen(true);
      } else {
        console.error("AI generation failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setAILoading(false);
    }
  };

  // --- Accept AI-generated Career Objective ---
  const handleAcceptCareerObjectiveAI = () => {
    if (!aiData) return;

    // Populate form with AI-generated objective
    reset({ career_objective: aiData });
    setSuccessMessage("✅ AI-generated career objective populated. Review before saving.");
    setPreviewOpen(false);
    setAIData("");
  };


  return (
    <FormProvider {...methods}>
      <div className="p-6 border rounded-md bg-whiteBg shadow-sm w-full mx-auto">
        <h2 className="text-h2 font-semibold text-center mb-4">Career Objective</h2>

        <p className="text-subHeadingGray text-sm mb-6 text-center">
          Enter a clear and concise career objective highlighting your desired role, skills, and contribution to the organization.
        </p>

        {/* AI Button */}
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            label="✨ Generate Career Objective with AI"
            onClick={() => setAIModalOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Career Objective *
              <textarea
                {...register("career_objective")}
                placeholder="e.g., To secure a challenging role as a Software Developer where I can apply my coding skills and grow professionally."
                disabled={isLoading}
                className={`w-full h-28 p-3 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.career_objective
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
                  } disabled:opacity-50`}
              />
            </label>
            <p className="text-gray-400 italic text-xs mt-1">
              Tip: Keep it under 2–3 sentences. Highlight your main skill and career goal.
            </p>
            {errors.career_objective && (
              <p className="text-gray-500 text-xs italic mt-1">{errors.career_objective.message}</p>
            )}
          </div>

          <Button
            type="submit"
            onClick={() => { }}
            label={isLoading ? "Saving..." : editingObjective ? "Update" : "Submit"}
            disabled={isLoading}
            className="text-white"
          />

          <Loader
            loading={isLoading}
            message={isLoading ? `Saving your career objective... (${elapsedTime}s elapsed)` : ""}
          />
        </form>

        {successMessage && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* --- AI Modals --- */}
        <AIInputModal
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSubmit={handleGenerateCareerObjectiveFromAI}
          loading={isAILoading}
          defaultText={aiTemplates[currentSection]} // <-- template for that section
          title={`Edit ${currentSection.replace("_", " ")}`}
          description="You can edit this text. AI will extract the info and fill the form."
          placeholder="Example: I want a software engineering role where I can utilize my React and Node.js skills while growing in leadership."
          generateLabel="Generate"
          cancelLabel="Cancel"
        />

        <AIPreviewModal
          isOpen={isPreviewOpen}
          data={aiData}
          onClose={() => setPreviewOpen(false)}
          onAccept={handleAcceptCareerObjectiveAI}
          title="Review AI-Generated Career Objective"
          description="Confirm the AI-generated career objective before populating the form."
          acceptLabel="Accept & Autofill"
          discardLabel="Discard"
        />
      </div>
    </FormProvider>
  );
};

export default CareerObjectiveFormDetails;
