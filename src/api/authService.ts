/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/authService.ts
import { type AppDispatch } from "../store/store";
import { loginSuccess, logoutSuccess } from "../store/authSlice";

export interface SignUp {
  email: string;
  password: string;
  confirmPassword?: string; // frontend only
  first_name: string;
  middle_name?: string;
  last_name: string;
}


const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL;



export const authService = {
async signUp(dispatch: AppDispatch, data: SignUp) {
  try {
    console.log("➡️ Signup data before sending:", data);

    const payload = {
      ...data,
      confirm_password: data.confirmPassword,
    };
    delete payload.confirmPassword;

    const url = `${API_BASE_URL}/auth/signup/`;
    console.log("➡️ Sending POST request to URL:", url);
    console.log("➡️ Payload:", JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("⬅️ Raw response:", response);

    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {
      console.warn("⚠️ No JSON returned from backend");
    }
    console.log("⬅️ Response JSON:", responseData);

    if (!response.ok) {
      throw { response: { data: responseData, status: response.status, url } };
    }

    dispatch(
      loginSuccess({
        access: responseData.access,
        refresh: responseData.refresh,
        user: responseData.user,
      })
    );

    localStorage.setItem("access", responseData.access);
    localStorage.setItem("refresh", responseData.refresh);
    localStorage.setItem("user", JSON.stringify(responseData.user));

    return { status: response.status, data: responseData };
  } catch (err: any) {
    console.error("❌ Signup error:", err);
    throw err;
  }
}


  ,

  async login(dispatch: AppDispatch, data: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const message = responseData?.detail || "Login failed";
        throw new Error(`${response.status}: ${message}`);
      }

      // ✅ Store tokens and user in localStorage
      localStorage.setItem("access", responseData.access);
      localStorage.setItem("refresh", responseData.refresh);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      // ✅ Dispatch with correct payload
      dispatch(
        loginSuccess({
          access: responseData.access,
          refresh: responseData.refresh,
          user: responseData.user,
        })
      );

      return { status: response.status, data: responseData };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.message || "Something went wrong during login");
    }
  },

  async logout(dispatch: AppDispatch) {
    try {
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        const message = responseData?.detail || "Logout failed";
        throw new Error(message);
      }

      // ✅ Clear localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      dispatch(logoutSuccess());

      return { status: response.status, message: "Logout successful" };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.message || "Something went wrong during logout");
    }
  },
};
