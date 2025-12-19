import type { RisalaFormData } from "../../types/risalaTypes";

// Build the payload to store in Redux (with raw_data + cleaned_fields)
export function buildBackendPayload(data: RisalaFormData): RisalaFormData {
  const eventType = data.event_type;

  const payload: RisalaFormData = {
    // Step 1
    event_type: data.event_type,
    event_title: data.event_title || "",
    event_date: data.event_date || "",
    event_location: data.event_location || "",

    // Step 2
    guest_of_honor: data.guest_of_honor || "",
    guest_title: data.guest_title || "",
    organization_name: data.organization_name || "",
    organization_representative: data.organization_representative || "",

    // Step 3
    purpose_statement: data.purpose_statement || "",
    background_info: data.background_info || "",
    main_message: data.main_message || "",

    // Step 4 - harusi
    bride_name: eventType === "harusi" ? data.bride_name || "" : "",
    groom_name: eventType === "harusi" ? data.groom_name || "" : "",
    wedding_theme: eventType === "harusi" ? data.wedding_theme || "" : "",

    // Step 4 - msiba
    deceased_name: eventType === "msiba" ? data.deceased_name || "" : "",
    relationship: eventType === "msiba" ? data.relationship || "" : "",
    tribute_summary: eventType === "msiba" ? data.tribute_summary || "" : "",

    // Step 4 - uzinduzi
    project_name: eventType === "uzinduzi" ? data.project_name || "" : "",
    project_goal: eventType === "uzinduzi" ? data.project_goal || "" : "",
    project_beneficiaries: eventType === "uzinduzi" ? data.project_beneficiaries || "" : "",

    // Step 4 - mgeni rasmi
    program_name: eventType === "mgeni_rasmi" ? data.program_name || "" : "",
    program_theme: eventType === "mgeni_rasmi" ? data.program_theme || "" : "",

    // Step 5
    requests: data.requests || "",
    closing_statement: data.closing_statement || "",
    presenter_name: data.presenter_name || "",
    presenter_title: data.presenter_title || "",
  };

  return payload;
}
