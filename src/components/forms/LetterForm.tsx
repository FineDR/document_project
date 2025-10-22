import React, { useEffect } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { translations } from "../../features/letters/translations";
import { generateLetterBodyAI } from '../../features/letters/lettersSlice';
import { useAppDispatch } from "../../hooks/hooks";
export interface LetterFormValues {
  phoneNumber: string;
  email: string;
  city: string;
  date: string;
  recipientName: string;
  organization: string;
  address: string;
  recipientCity: string;
  salutation: string;
  subject: string;
  body: string;
  closingPhrase: string;
  senderSignature?: string;
  senderName: string;
}

interface LetterFormProps {
  onSubmit: SubmitHandler<LetterFormValues>;
  defaultValues?: Partial<LetterFormValues>;
  onChange?: (data: LetterFormValues) => void;
  lang: "en" | "sw";
  onAIFill?: (currentValues: LetterFormValues) => Promise<string>;
}

const LetterForm: React.FC<LetterFormProps> = ({
  onSubmit,
  defaultValues,
  onChange,
  onAIFill,
  lang,
}) => {
  const safeDefaults: LetterFormValues = {
    phoneNumber: defaultValues?.phoneNumber ?? "",
    email: defaultValues?.email ?? "",
    city: defaultValues?.city ?? "",
    date: defaultValues?.date ?? "",
    recipientName: defaultValues?.recipientName ?? "",
    organization: defaultValues?.organization ?? "",
    address: defaultValues?.address ?? "",
    recipientCity: defaultValues?.recipientCity ?? "",
    salutation: defaultValues?.salutation ?? "",
    subject: defaultValues?.subject ?? "",
    body: defaultValues?.body ?? "",
    closingPhrase: defaultValues?.closingPhrase ?? "",
    senderSignature: defaultValues?.senderSignature ?? "",
    senderName: defaultValues?.senderName ?? "",
  };
const dispatch = useAppDispatch();
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<LetterFormValues>({
    defaultValues: safeDefaults,
  });

  const formValues = useWatch({ control, defaultValue: safeDefaults }) as LetterFormValues;

  useEffect(() => {
    if (onChange) onChange(formValues);
  }, [formValues, onChange]);

  const handleAIFillClick = async () => {
  try {
    // Dispatch the thunk with current form values
    const resultAction = await dispatch(generateLetterBodyAI(formValues));

    // Check if fulfilled
    if (generateLetterBodyAI.fulfilled.match(resultAction)) {
      // Update the "body" field in your form
      setValue("body", resultAction.payload);
    } else {
      console.error("AI generation failed:", resultAction.payload);
    }
  } catch (error) {
    console.error("Unexpected error while generating AI body:", error);
  }
};

  const t = translations[lang];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formValues);
      }}
      className="space-y-4"
    >
      {/* CONTACT INFORMATION */}
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{t.contactInfo}</h3>
      <InputField
        name="phoneNumber"
        label={t.phoneNumber}
        type="text"
        register={register("phoneNumber", { required: t.phoneNumber + " is required" })}
        error={errors.phoneNumber?.message}
        value={formValues.phoneNumber}
        onChange={(val) => setValue("phoneNumber", val)}
      />
      <InputField
        name="email"
        label={t.email}
        type="email"
        register={register("email", { required: t.email + " is required" })}
        error={errors.email?.message}
        value={formValues.email}
        onChange={(val) => setValue("email", val)}
      />
      <InputField
        name="city"
        label={t.city}
        type="text"
        register={register("city", { required: t.city + " is required" })}
        error={errors.city?.message}
        value={formValues.city}
        onChange={(val) => setValue("city", val)}
      />
      <InputField
        name="date"
        label={t.date}
        type="date"
        register={register("date", { required: t.date + " is required" })}
        error={errors.date?.message}
        value={formValues.date}
        onChange={(val) => setValue("date", val)}
      />

      {/* RECIPIENT INFORMATION */}
      <h3 className="text-lg font-semibold mt-6 text-gray-800">{t.recipientInfo}</h3>
      <InputField
        name="recipientName"
        label={t.recipientName}
        type="text"
        register={register("recipientName", { required: t.recipientName + " is required" })}
        error={errors.recipientName?.message}
        value={formValues.recipientName}
        onChange={(val) => setValue("recipientName", val)}
      />
      <InputField
        name="organization"
        label={t.organization}
        type="text"
        register={register("organization", { required: t.organization + " is required" })}
        error={errors.organization?.message}
        value={formValues.organization}
        onChange={(val) => setValue("organization", val)}
      />
      <InputField
        name="address"
        label={t.address}
        type="text"
        register={register("address")}
        value={formValues.address}
        onChange={(val) => setValue("address", val)}
      />
      <InputField
        name="recipientCity"
        label={t.recipientCity}
        type="text"
        register={register("recipientCity")}
        value={formValues.recipientCity}
        onChange={(val) => setValue("recipientCity", val)}
      />
      <InputField
        name="salutation"
        label={t.salutation}
        type="text"
        register={register("salutation")}
        value={formValues.salutation}
        onChange={(val) => setValue("salutation", val)}
      />

      {/* LETTER DETAILS */}
      <h3 className="text-lg font-semibold mt-6 text-gray-800">{t.letterDetails}</h3>
      <InputField
        name="subject"
        label={t.subject}
        type="text"
        register={register("subject")}
        error={errors.subject?.message}
        value={formValues.subject}
        onChange={(val) => setValue("subject", val)}
      />
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          {lang === "sw" ? "Mwili wa Barua" : "Letter Body"}
        </label>
        <textarea
          {...register("body", { required: lang === "sw" ? "Mwili wa barua unahitajika" : "Letter body is required" })}
          value={formValues.body}
          onChange={(e) => setValue("body", e.target.value)}
          placeholder={lang === "sw" ? "Andika mwili mzima wa barua hapa..." : "Write the full letter body here..."}
          className="w-full border border-gray-300 rounded-md p-2 h-48 resize-y focus:ring-2 focus:ring-redMain"
        ></textarea>
        {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
      </div>

      {/* SIGNATURE */}
      <h3 className="text-lg font-semibold mt-6 text-gray-800">{t.signature}</h3>
      <InputField
        name="closingPhrase"
        label={t.closingPhrase}
        type="text"
        register={register("closingPhrase")}
        value={formValues.closingPhrase}
        onChange={(val) => setValue("closingPhrase", val)}
      />

      <div className="flex flex-col space-y-2 mt-2">
        <label className="text-sm font-medium text-gray-700">{lang === "sw" ? "Saini (Andika au Pakia Picha)" : "Signature (Type or Upload Image)"}</label>
        <textarea
          value={formValues.senderSignature || ""}
          onChange={(e) => setValue("senderSignature", e.target.value)}
          placeholder={lang === "sw" ? "Andika saini yako hapa..." : "Type your signature here..."}
          className="w-full border border-gray-300 rounded-md p-2 resize-y focus:ring-2 focus:ring-redMain"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setValue("senderSignature", reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
        {formValues.senderSignature?.startsWith("data:image/") && (
          <img src={formValues.senderSignature} alt="Signature Preview" className="h-20 mt-2" />
        )}
      </div>

      <InputField
        name="senderName"
        label={t.senderName}
        type="text"
        register={register("senderName")}
        value={formValues.senderName}
        onChange={(val) => setValue("senderName", val)}
      />

      {/* SUBMIT BUTTON */}
      <div className="flex gap-4 pt-4">
        <Button onClick={() => {}} type="submit" label={t.button} />
        <Button type="button" label={lang === "sw" ? "Jaza KiAI" : "Fill with AI"} onClick={handleAIFillClick} />
      </div>
    </form>
  );
};

export default LetterForm;
