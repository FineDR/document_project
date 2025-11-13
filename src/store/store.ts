// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
// import cvReducer from "./cvSlice";
import adminUsersReducer from "./adminUsersSlice";
import achievementReducer from "../features/achievements/achievementsSlice";
import certificatesReducer from "../features/certificates/certificatesSlice";
import experienceReducer from "../features/experiences/workExperiencesSlice";
import skillsReducer from "../features/skills/skillsSlice";
import languagesReducer from "../features/languages/languagesSlice";
import authentReducer from "../features/auth/authSlice";
import jobReducer from "../features/jobs/jobsSlice";
import languageReducer from "../features/languages/languagesSlice";
import letterReducer from "../features/letters/lettersSlice";
import personalReducer from "../features/personalDetails/personalDetailsSlice";
import projectsReducer from "../features/projects/projectsSlice";
import carerObjectiveReducer from "../features/carerobjectives/carerObjectivesSlice";
import educationReducer from "../features/educations/educationsSlice";
import civReducer from "../features/cv/cvSlice";
import paymentReducer from "../features/payments/paymentsSlice";
import downloadsReducer from "../features/downloads/downloadsSlice"
import uiReducer from "../store/uiSlice"
// import profileReducer from "../features/certificates/profileSlice";


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ Persist config for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["access", "refresh", "user"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authentReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // cv: cvReducer,
    adminUsers: adminUsersReducer,
    jobs: jobReducer, // <-- added jobs slice here
    achievements: achievementReducer,
    certificates: certificatesReducer,
    experiences: experienceReducer,
    skills: skillsReducer,
    languages: languageReducer,
    letters: letterReducer,
    personalDetails: personalReducer,
    projects: projectsReducer,
    carerObjectives: carerObjectiveReducer,
    educations: educationReducer, 
    language: languagesReducer,
    cv: civReducer,
    payments: paymentReducer,
     downloads: downloadsReducer,
     ui: uiReducer,
    // profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
