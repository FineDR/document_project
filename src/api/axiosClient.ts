import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// --- Axios instance ---
const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- Helper functions ---
const sanitizeToken = (token: string | null | undefined): string | null => {
  if (!token) return null;
  return token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token;
};

const getPersistedAuth = () => {
  try {
    const persistedRoot = localStorage.getItem("persist:root");
    if (!persistedRoot) return null;
    const root = JSON.parse(persistedRoot);

    // root.auth is itself a JSON string; parse it
    const auth = root.auth ? JSON.parse(root.auth) : {};

    // 🔧 Parse tokens once more if they are stringified JSON
    const accessRaw = auth.access;
    const refreshRaw = auth.refresh;
    const access =
      typeof accessRaw === "string" && accessRaw.startsWith('"')
        ? JSON.parse(accessRaw)
        : accessRaw;
    const refresh =
      typeof refreshRaw === "string" && refreshRaw.startsWith('"')
        ? JSON.parse(refreshRaw)
        : refreshRaw;

    return {
      access: sanitizeToken(access),
      refresh: sanitizeToken(refresh),
    };
  } catch (e) {
    console.warn("getPersistedAuth parse error:", e);
    return null;
  }
};


const getRefreshToken = (): string | null => {
  const token = getPersistedAuth()?.refresh || localStorage.getItem("refreshToken");
  return sanitizeToken(token);
};

const getAccessToken = (): string | null =>
  sanitizeToken(getPersistedAuth()?.access) || localStorage.getItem("token");

const setAccessToken = (token: string) => localStorage.setItem("token", token);
const setRefreshToken = (token: string) => localStorage.setItem("refreshToken", token);

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// --- Token refresh queue ---
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// --- Request interceptor ---
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      // 🧩 Log the refresh token for debugging
      console.groupCollapsed("🔁 Token Refresh Debug");
      console.log("BASE_URL:", BASE_URL);
      console.log("Raw refresh token:", localStorage.getItem("refreshToken"));
      console.log("Parsed persisted refresh token:", getPersistedAuth()?.refresh);
      console.log("Final sanitized refresh token being sent:", refreshToken);
      console.groupEnd();

      if (!refreshToken) {
        console.warn("🚫 No refresh token found, clearing auth and redirecting.");
        clearAuth();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });

        // 🧩 Log the backend response
        console.log("✅ Token refresh response:", res.data);

        const newAccessToken = sanitizeToken(res.data.access) || "";
        const newRefreshToken = sanitizeToken(res.data.refresh) || refreshToken;

        // Persist updated tokens safely
        const persistedRoot = localStorage.getItem("persist:root");
        if (persistedRoot) {
          const root = JSON.parse(persistedRoot);
          const authData = root.auth ? JSON.parse(root.auth) : {};
          authData.access = newAccessToken;
          authData.refresh = newRefreshToken;
          root.auth = JSON.stringify(authData);
          localStorage.setItem("persist:root", JSON.stringify(root));
        }

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        console.error("❌ Token refresh failed:", err);
        processQueue(err, null);
        isRefreshing = false;
        clearAuth();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
