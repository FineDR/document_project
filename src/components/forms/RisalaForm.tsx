import { useForm } from "react-hook-form";
import Button from "../formElements/Button";
import InputField from "../formElements/InputField";
import SelectInputField from "../formElements/SelectInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { risalaSchema } from "../forms/cvValidationSchema";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../store/store";
import {  buildBackendPayload } from "../../features/risala/risalaUtils";
import {
  savePartial,
  saveFinal,
  nextStep as nextStepAction,
  previousStep as previousStepAction,
  submitRisala
} from "../../features/risala/risalaSlice";

type RisalaFormData = z.infer<typeof risalaSchema>;
type FieldName = keyof RisalaFormData;

const formSteps: Record<number, { fields: FieldName[]; eventSpecific?: Record<string, FieldName[]> }> = {
  1: { fields: ["event_type", "event_title", "event_date", "event_location"] },
  2: { fields: ["guest_of_honor", "guest_title", "organization_name", "organization_representative"] },
  3: { fields: ["purpose_statement", "background_info", "main_message"] },
  4: {
    fields: [],
    eventSpecific: {
      harusi: ["bride_name", "groom_name", "wedding_theme"],
      msiba: ["deceased_name", "relationship", "tribute_summary"],
      uzinduzi: ["project_name", "project_goal", "project_beneficiaries"],
      mgeni_rasmi: ["program_name", "program_theme"],
    },
  },
  5: { fields: ["requests", "closing_statement", "presenter_name", "presenter_title"] },
};
const fieldTips: Record<FieldName, string> = {
  // Step 1 — Basic Event Info
  event_type: "Chagua aina ya tukio ili uonyeshwe sehemu maalumu za tukio hilo.",
  event_title: "Weka jina kamili la tukio. Mfano: 'Harusi ya Asha & John' au 'Mazishi ya Bibi Rehema'.",
  event_date: "Chagua tarehe halisi ya tukio. Hii inaonekana kwenye utangulizi wa risala.",
  event_location: "Taja mahali panapofanyika tukio. Mfano: 'Ukumbi wa City Hall' au 'Nyumbani kwa marehemu'.",

  // Step 2 — Guest & Organization Info
  guest_of_honor: "Weka jina la mgeni rasmi au mtu mashuhuri anayehudhuria.",
  guest_title: "Taja cheo cha mgeni rasmi. Mfano: 'Mkurugenzi', 'Diwani', 'Waziri'.",
  organization_name: "Andika jina la taasisi, familia au kitengo kinachohusika na risala.",
  organization_representative: "Taja jina la mwakilishi rasmi anayewasilisha risala kwa niaba ya taasisi/familia.",

  // Step 3 — Message Content
  purpose_statement: "Eleza madhumuni makuu ya risala. Mfano: 'Kutoa shukrani', 'Kughani sifa', n.k.",
  background_info: "Toa historia fupi au maelezo ya awali yanayohusiana na tukio.",
  main_message: "Huu ndiyo moyo wa risala. Andika ujumbe wako mkuu kwa uwazi na heshima.",

  // Step 4 — Event-Specific Fields (Harusi)
  bride_name: "Andika jina kamili la bibi harusi kama litakavyotajwa kwenye risala.",
  groom_name: "Andika jina kamili la bwana harusi.",
  wedding_theme: "Eleza mandhari au kaulimbiu ya harusi. Mfano: 'Rangi ya Bluu na Dhahabu'.",

  // Step 4 — Event-Specific Fields (Msiba)
  deceased_name: "Andika jina la marehemu kwa ukamilifu na kwa heshima.",
  relationship: "Eleza uhusiano wa marehemu na familia au msomaji. Mfano: 'Bibi', 'Kaka'.",
  tribute_summary: "Andika sifa kuu, mchango au maisha ya marehemu kwa muhtasari.",

  // Step 4 — Event-Specific Fields (Uzinduzi)
  project_name: "Weka jina la mradi unaozinduliwa.",
  project_goal: "Eleza lengo kuu la mradi kwa sentensi moja au mbili.",
  project_beneficiaries: "Taja watu au kikundi kinachonufaika na mradi.",

  // Step 4 — Event-Specific Fields (Mgeni Rasmi)
  program_name: "Weka jina la programu au hafla inayohusu ugeni rasmi.",
  program_theme: "Andika kaulimbiu au dhima ya programu.",

  // Step 5 — Finishing & Signature
  requests: "Taja maombi, mapendekezo au matakwa yanayopaswa kuwasilishwa.",
  closing_statement: "Andika tamko rasmi la kumalizia risala kwa heshima.",
  presenter_name: "Weka jina la anayetoa au kusoma risala.",
  presenter_title: "Andika cheo cha msomaji wa risala. Mfano: 'Katibu', 'Mwenyekiti'.",
};

const fieldMeta: Record<FieldName, { label: string; placeholder?: string; type: string }> = {
  event_type: { label: "Aina ya Tukio", type: "select" },
  event_title: { label: "Jina la Tukio", placeholder: "Mfano: Harusi ya Asha & John", type: "text" },
  event_date: { label: "Tarehe ya Tukio", type: "date" },
  event_location: { label: "Mahali pa Tukio", placeholder: "Mfano: Ukumbi wa City Hall", type: "text" },
  guest_of_honor: { label: "Mgeni Rasmi", placeholder: "Jina la mgeni wa heshima", type: "text" },
  guest_title: { label: "Cheo cha Mgeni Rasmi", placeholder: "Mfano: Rais wa Kampuni", type: "text" },
  organization_name: { label: "Jina la Taasisi", placeholder: "Mfano: Chama cha Vijana", type: "text" },
  organization_representative: { label: "Uwakilishi", placeholder: "Jina la mwakilishi", type: "text" },
  purpose_statement: { label: "Lengo Kuu la Risala", placeholder: "Mfano: Kupongeza harusi hii", type: "text" },
  background_info: { label: "Historia / Maelezo ya Awali", placeholder: "Taarifa fupi za awali", type: "text" },
  main_message: { label: "Ujumbe Mkuu wa Risala", placeholder: "Ujumbe unaotakiwa kuwasilishwa", type: "text" },
  deceased_name: { label: "Jina la Marehemu", placeholder: "Jina kamili la marehemu", type: "text" },
  relationship: { label: "Mahusiano na Marehemu", placeholder: "Mfano: Bibi", type: "text" },
  tribute_summary: { label: "Muhtasari wa Sifa/Wasifu", placeholder: "Andika sifa muhimu", type: "text" },
  requests: { label: "Maombi / Mahitaji", placeholder: "Andika maombi yako", type: "text" },
  closing_statement: { label: "Tamko la Kumalizia", placeholder: "Andika tamko la kumalizia", type: "text" },
  presenter_name: { label: "Jina la Msomaji wa Risala", placeholder: "Jina kamili", type: "text" },
  presenter_title: { label: "Cheo cha Msomaji", placeholder: "Mfano: Mkurugenzi", type: "text" },
  bride_name: { label: "Jina la Bibi Harusi", placeholder: "Mfano: Asha", type: "text" },
  groom_name: { label: "Jina la Bwana Harusi", placeholder: "Mfano: John", type: "text" },
  wedding_theme: { label: "Mandhari ya Harusi", placeholder: "Mfano: Rangi ya Bluu", type: "text" },
  project_name: { label: "Jina la Mradi", placeholder: "Mfano: Mradi wa maji safi", type: "text" },
  project_goal: { label: "Lengo la Mradi", placeholder: "Mfano: Kuleta maji safi kwa kijiji", type: "text" },
  project_beneficiaries: { label: "Wafaidika Wakuu", placeholder: "Mfano: Jamii ya kijiji", type: "text" },
  program_name: { label: "Jina la Programu", placeholder: "Mfano: Uzinduzi wa Mradi", type: "text" },
  program_theme: { label: "Kauli Mbiu", placeholder: "Mfano: Kuinua Elimu", type: "text" },
};

const RisalaForm = () => {
  const dispatch = useAppDispatch();
  const risalaState = useAppSelector((state: RootState) => state.risala);
  const { step } = risalaState;
  const totalSteps = 5;

  const initialValues: Partial<RisalaFormData> | undefined = risalaState.data
    ? {
        ...(risalaState.data as any),
        // ensure event_type satisfies the union expected by the form
        event_type: risalaState.data.event_type as unknown as RisalaFormData["event_type"]
      }
    : undefined;

  const { register, watch, trigger,reset, handleSubmit, formState: { errors } } = useForm<RisalaFormData>({
    resolver: zodResolver(risalaSchema),
    mode: "onBlur",
    defaultValues: initialValues
  });

  const eventType = watch("event_type");

  const fieldsToRender = () => {
    const stepConfig = formSteps[step];
    if (step === 4 && eventType) return stepConfig.eventSpecific?.[eventType] || [];
    return stepConfig.fields;
  };

  const next = async () => {
    const fields = fieldsToRender();
    const isStepValid = await trigger(fields);
    if (isStepValid) {
      const currentValues = fields.reduce((acc, field) => {
        acc[field] = watch(field) as any;
        return acc;
      }, {} as Partial<RisalaFormData>);
      dispatch(savePartial(currentValues));
      dispatch(nextStepAction());
    }
  };

  const back = () => dispatch(previousStepAction());

const onSubmit = async (data: RisalaFormData) => {
  try {
    // 1. Build backend payload
    const backendPayload = buildBackendPayload(data);
    console.log("Submitting backend payload:", backendPayload);

    // 2. Dispatch submit action
    await dispatch(submitRisala(backendPayload));

    // 3. Clear the form after successful submit
    reset({
      event_type: undefined, 
      event_title: "",
      event_date: "",
      event_location: "",
      guest_of_honor: "",
      guest_title: "",
      organization_name: "",
      organization_representative: "",
      purpose_statement: "",
      background_info: "",
      main_message: "",
      requests: "",
      closing_statement: "",
      presenter_name: "",
      presenter_title: "",
      // Event-specific fields
      bride_name: "",
      groom_name: "",
      wedding_theme: "",
      deceased_name: "",
      relationship: "",
      tribute_summary: "",
      project_name: "",
      project_goal: "",
      project_beneficiaries: "",
      program_name: "",
      program_theme: "",
    });

    // Optional: Reset step to 1 if needed
    dispatch(previousStepAction()); // or dispatch(resetStepAction())
    
  } catch (err) {
    console.error("Submit failed:", err);
  }
};

  return (
    <div className="max-w-2xl mt-20 mx-auto p-6 bg-background shadow-md rounded-lg text-text">
      <div className="mb-6">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm mt-1 text-center">Hatua {step} ya {totalSteps}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fieldsToRender().map(fieldName => {
          const meta = fieldMeta[fieldName];
          if (!meta) return null;
          if (meta.type === "select") return (
            <SelectInputField
              key={fieldName}
              label={meta.label}
              name={fieldName}
              register={register}
              options={[
                { label: "Harusi", value: "harusi" },
                { label: "Msiba", value: "msiba" },
                { label: "Uzinduzi", value: "uzinduzi" },
                { label: "Mgeni Rasmi", value: "mgeni_rasmi" }
              ]}
              className="mb-4"
            />
          );
          return (
            <div key={fieldName} className="mb-4">
              <InputField
                name={fieldName}
                type={meta.type}
                label={meta.label}
                placeholder={meta.placeholder}
                register={register(fieldName)}
                error={errors[fieldName]?.message}
              />{
                fieldTips[fieldName] && (
                  <p className="text-xs text-gray-500 mt-1">{fieldTips[fieldName]}</p>
                )
              }
            </div>
          );
        })}

        <div className="flex gap-2 mt-4">
          {step > 1 && <Button label="Nyuma" onClick={back} type="button" />}
          {step < totalSteps && <Button label="Next" onClick={next} type="button" />}
          {step === totalSteps && <Button onClick={()=>{}} type="submit" label="Tengeneza Risala" />}
        </div>
      </form>
    </div>
  );
};

export default RisalaForm;
