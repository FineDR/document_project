import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { generatePDF as apiGeneratePDF } from "../../api/reportApi";

// ✅ Async thunk for generating PDF
export const generatePDF = createAsyncThunk(
  "project/generatePDF",
  async (payload: { data: ProjectData; logoFile: File | null }) => {
    const { data, logoFile } = payload;
    const pdfBlob = await apiGeneratePDF(data, logoFile);
    return pdfBlob;
  }
);

export interface GroupMember {
  reg_no: string;
  name: string;
  role: string;
}

export interface ProjectData {
  university: string;
  college: string;
  department: string;
  project_type: string;
  title: string;
  supervisor: string;
  subject_name: string;
  subject_code: string;
  submission_date: string;
  academic_year: string;
  group_members: GroupMember[];
}

const defaultData: ProjectData = {
  university: "THE UNIVERSITY OF DODOMA",
  college: "COLLEGE OF INFORMATICS AND VIRTUAL EDUCATION",
  department: "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING",
  project_type: "FINAL YEAR PROJECT PROPOSAL",
  title: "LOCALIZED JOB FINDER APP",
  supervisor: "DR. EMMANUEL K. RUTASHOBYA",
  subject_name: "INTRODUCTION TO SOFTWARE ENGINEERING",
  subject_code: "CSE 115",
  submission_date: "27/9/2024",
  academic_year: "2024/2025",
  group_members: [
    { reg_no: "T21-03-13930", name: "Student A", role: "Team Lead" },
    { reg_no: "T21-03-01634", name: "Student B", role: "Developer" },
    { reg_no: "T21-03-02253", name: "Student C", role: "Tester" },
    { reg_no: "T21-03-05606", name: "Student D", role: "Designer" },
    { reg_no: "T21-03-09347", name: "Student E", role: "DevOps" },
  ],
};


interface ProjectState {
  data: ProjectData;
  logoFile: File | null;
  pdfBlob: Blob | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  data: defaultData,
  logoFile: null,
  pdfBlob: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ key: keyof ProjectData; value: string }>) => {
      const { key, value } = action.payload;
      if (key !== "group_members") {
        (state.data[key] as string) = value;
      }
    },
    setGroupMember: (state, action: PayloadAction<{ index: number; field: keyof GroupMember; value: string }>) => {
      state.data.group_members[action.payload.index][action.payload.field] = action.payload.value;
    },
    addMember: (state) => {
      state.data.group_members.push({ reg_no: "", name: "", role: "" });
    },
    removeMember: (state, action: PayloadAction<number>) => {
      state.data.group_members.splice(action.payload, 1);
    },
    setLogoFile: (state, action: PayloadAction<File | null>) => {
      state.logoFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePDF.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePDF.fulfilled, (state, action: PayloadAction<Blob>) => {
        state.loading = false;
        state.pdfBlob = action.payload;
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to generate PDF";
      });
  },
});

export const { setField, setGroupMember, addMember, removeMember, setLogoFile } = projectSlice.actions;
export default projectSlice.reducer;
