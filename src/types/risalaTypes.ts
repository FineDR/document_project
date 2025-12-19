import { z } from "zod";
import { risalaSchema } from "../components/forms/cvValidationSchema";

export type RisalaFormData = z.infer<typeof risalaSchema>;

/**
 * RisalaData represents the full payload returned by the backend
 * but `raw_data` and `cleaned_fields` can be partial when creating/updating before submission.
 */
export interface RisalaData {
  raw_data: Partial<{
    id: number;
    event_type: string;
    event_title: string;
    event_date: string;
    event_location: string;
    guest_of_honor?: string;
    guest_title?: string;
    organization_name?: string;
    organization_representative?: string;
    purpose_statement?: string;
    background_info?: string;
    main_message?: string;
    bride_name?: string;
    groom_name?: string;
    wedding_theme?: string;
    deceased_name?: string;
    relationship?: string;
    tribute_summary?: string;
    requests?: string;
    closing_statement?: string;
    presenter_name?: string;
    presenter_title?: string;
    created_at: string;
    updated_at: string;
  }>;
  cleaned_fields: Partial<{
    event_type: string;
    event_title: string;
    event_date: string;
    event_location: string;
    guest_of_honor?: string;
    guest_title?: string;
    organization_name?: string;
    organization_representative?: string;
    purpose_statement?: string;
    background_info?: string;
    main_message?: string;
    bride_name?: string;
    groom_name?: string;
    wedding_theme?: string;
    deceased_name?: string;
    relationship?: string;
    tribute_summary?: string;
    requests?: string;
    closing_statement?: string;
    presenter_name?: string;
    presenter_title?: string;
  }>;
  event_type: string;
  generated_risala: string;
}
