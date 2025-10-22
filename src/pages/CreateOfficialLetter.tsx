import React, { useState } from "react";
import LetterForm, { type LetterFormValues } from "../components/forms/LetterForm";
import { translations } from "../features/letters/translations"; // <-- you'll create this file
import { addLetter } from "../features/letters/lettersSlice";
import { useAppDispatch } from "../hooks/hooks";
const CreateOfficialLetter: React.FC = () => {
  const [lang, setLang] = useState<"en" | "sw">("sw");
  const [alignContact, setAlignContact] = useState<"start" | "end">("end");
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<LetterFormValues>({
    phoneNumber: "",
    email: "",
    city: "",
    date: "",
    recipientName: "",
    organization: "",
    address: "",
    recipientCity: "",
    salutation: "",
    subject: "",
    body: "", // ✅ single letter body field
    closingPhrase: "",
    senderName: "",
    senderSignature: "",
  });

  const handleFormSubmit = (data: LetterFormValues) => {
    const payload = {
      ...data,
      lang,          // include selected language
      alignContact,  // include contact alignment
    };
    console.log("data",payload);
    dispatch(addLetter(payload))
      .unwrap()
      .then(() => {
        alert("Letter created successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create letter.");
      });
  };
  const t = translations[lang]; // current language texts

  return (
    <div className="container mx-auto mt-14 p-4">
      {/* ======================= */}
      {/* LANGUAGE & ALIGNMENT */}
      {/* ======================= */}
      <div className="flex justify-end mb-4 space-x-4">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "sw")}
          className="border rounded px-3 py-1 bg-white shadow-sm"
        >
          <option value="sw">Kiswahili</option>
          <option value="en">English</option>
        </select>

        <select
          value={alignContact}
          onChange={(e) => setAlignContact(e.target.value as "start" | "end")}
          className="border rounded px-3 py-1 bg-white shadow-sm"
        >
          <option value="end">Align Right</option>
          <option value="start">Align Left</option>
        </select>
      </div>

      <h2 className="mt-10 text-h1 text-redMain text-center">{t.title}</h2>

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* ======================= */}
        {/* FORM AREA */}
        {/* ======================= */}
        <div className="w-full lg:w-1/2 p-6 rounded-md shadow-inner bg-gray-50">
          <LetterForm
            defaultValues={formValues}
            onSubmit={handleFormSubmit}
            onChange={setFormValues} // live update for preview
            lang={lang} // pass language to form
          />
        </div>

        {/* ======================= */}
        {/* LIVE PREVIEW */}
        {/* ======================= */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div
            className="bg-white border border-gray-300 shadow-md rounded-md w-[21cm] h-[29.7cm] p-10 overflow-y-auto"
            style={{ boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col w-full max-w-[18cm] mx-auto">

              {/* ======================= */}
              {/* CONTACT INFO */}
              {/* ======================= */}
              <div className={`flex flex-col ${alignContact === "end" ? "items-end text-right" : "items-start text-left"}`}>
                <div>
                  {lang === "sw" ? "Simu" : "Phone"}:{" "}
                  {formValues.phoneNumber
                    ? `${formValues.phoneNumber},`
                    : lang === "sw"
                      ? "0653 250 566,"
                      : "0653 250 566,"}
                </div>
                <div>
                  {lang === "sw" ? "Barua Pepe" : "Email"}:{" "}
                  {formValues.email
                    ? `${formValues.email},`
                    : lang === "sw"
                      ? "milambo@gmail.com,"
                      : "milambo@gmail.com,"}
                </div>
                <div>
                  {formValues.city
                    ? `${formValues.city},`
                    : lang === "sw"
                      ? "DAR ES SALAAM,"
                      : "DAR ES SALAAM,"}
                </div>
                <div>
                  {formValues.date
                    ? `${formValues.date}.`
                    : lang === "sw"
                      ? "04/07/2022."
                      : "07/04/2022."}
                </div>
              </div>

              {/* ======================= */}
              {/* RECIPIENT INFO */}
              {/* ======================= */}
              <div className="flex flex-col items-start mt-10">
                <div>
                  {formValues.recipientName
                    ? `${formValues.recipientName},`
                    : lang === "sw"
                      ? "Mkurugenzi Mkuu,"
                      : "The Managing Director,"}
                </div>
                <div>
                  {formValues.organization
                    ? `${formValues.organization},`
                    : lang === "sw"
                      ? "Shirika la Reli Tanzania,"
                      : "Tanzania Railways Corporation,"}
                </div>
                <div>
                  {formValues.address
                    ? `${formValues.address},`
                    : lang === "sw"
                      ? "S.L.P 76956,"
                      : "P.O. Box 76956,"}
                </div>
                <div>
                  {formValues.recipientCity
                    ? `${formValues.recipientCity}.`
                    : lang === "sw"
                      ? "DAR ES SALAAM."
                      : "DAR ES SALAAM."}
                </div>
                <div className="mt-10">
                  {formValues.salutation ||
                    (lang === "sw" ? "Ndugu," : "Dear Sir/Madam,")}
                </div>
              </div>

              {/* ======================= */}
              {/* SUBJECT */}
              {/* ======================= */}
              <div className="flex justify-center mt-10">
                <div className="text-center font-bold">
                  {lang === "sw" ? "YAH" : "REF"}:{" "}
                  {formValues.subject
                    ? formValues.subject.replace(/^YAH:\s*/, "")
                    : lang === "sw"
                      ? "OMBI LA KAZI YA FUNDI UMEME"
                      : "APPLICATION FOR ELECTRICIAN JOB"}
                </div>
              </div>

              {/* ======================= */}
              {/* BODY (Single Field) */}
              {/* ======================= */}
              {/* EDITABLE PARAGRAPH BODY */}
              {/* ======================= */}
              <div
                className="mt-10 text-justify space-y-4 leading-relaxed border border-gray-200 rounded-md p-2 min-h-[12rem] focus:outline-none focus:ring-2 focus:ring-redMain"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const target = e.target as HTMLDivElement;
                  setFormValues({ ...formValues, body: target.innerText });
                }}
              >
                {(formValues.body || "").split("\n").map((line, idx) => (
                  <p key={idx}>
                    {line.trim() !== "" ? line : <br />}
                  </p>
                ))}
                {!formValues.body && (
                  <>
                    {lang === "sw" ? (
                      <><p>
                        Mimi ni mwanamume mwenye umri wa miaka 30. Ninaomba Kazi ya Fundi Umeme
                        kama ilivyotangazwa na Shirika la Reli Tanzania siku ya tarehe 28/06/2022
                        katika tovuti, mitandao ya kijamii na mbao za matangazo.
                      </p>
                        <p>
                          Nina Cheti cha Fundi Umeme nilichotunukiwa kutoka VETA mwaka 2021. Pia nina
                          uzoefu wa kufanya kazi na nimefanya kazi na Taasisi ya 21st Century Holding LTD.
                        </p>
                        <p>
                          Kutokana na elimu yangu, uwezo wa kufanya kazi, uzoefu, na sifa nilizonazo,
                          ninaamini kuwa ninastahili nafasi hii. Nikipewa kazi hii, nitafanya kwa bidii
                          na kufuata maelekezo ya wakubwa wangu.
                        </p>
                        <p>
                          Nipo tayari kwa usaili siku yoyote nitakayohitajika. Natarajia majibu
                          mazuri kutoka kwako na nimeambatanisha nakala za vyeti vyangu kwa uthibitisho zaidi.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          I am a 30-year-old man applying for the position of Electrician as advertised
                          by the Tanzania Railways Corporation on 28/06/2022 through its website,
                          social media, and public notice boards.
                        </p>
                        <p>
                          I hold an Electrician Certificate awarded by VETA in 2021. I also have work
                          experience and have worked with 21st Century Holding LTD.
                        </p>
                        <p>
                          Based on my education, experience, and skills, I believe I am a suitable
                          candidate for this position. If granted this opportunity, I will work
                          diligently and follow all instructions provided.
                        </p>
                        <p>
                          I am available for an interview at any time and have attached copies of my
                          certificates for your reference. I look forward to a positive response.
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>



              <div className="flex flex-col items-start mt-10 space-y-2">
                {/* Closing Phrase */}
                <div
                  className="focus:outline-none focus:ring-2 focus:ring-redMain"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const target = e.target as HTMLDivElement;
                    setFormValues({ ...formValues, closingPhrase: target.innerText });
                  }}
                >
                  {formValues.closingPhrase || (lang === "sw" ? "Wako mtiifu," : "Yours faithfully,")}
                </div>

                {/* Signature Preview Only */}
                {formValues.senderSignature && (
                  <img
                    src={formValues.senderSignature} // Base64 preview
                    alt="Signature"
                    className="w-44 h-20 object-contain border-b-2 border-gray-500"
                  />
                )}

                {/* Sender Name below the line */}
                <div className="text-gray-700">
                  {formValues.senderName || "ISIKE MILAMBO"}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOfficialLetter;
