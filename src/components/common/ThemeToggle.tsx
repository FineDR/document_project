import { useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setTheme } from "../../store/uiSlice";
import { motion } from "framer-motion";

type Theme = "light" | "dark" | "professional";
const themes: Theme[] = ["light", "dark", "professional"];

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  // ✅ Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved && themes.includes(saved)) {
      dispatch(setTheme(saved));
    } else {
      // detect system preference if nothing saved
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      dispatch(setTheme(prefersDark ? "dark" : "light"));
    }
  }, [dispatch]);

  // ✅ Apply theme class to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(t));
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Cycle to the next theme
  const toggleTheme = () => {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    dispatch(setTheme(next));
  };

  // ✅ Choose icon by theme
  const Icon = theme === "light" ? FaSun : theme === "dark" ? FaMoon : MdWork;

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: 10 }}
      className="w-10 h-10 flex items-center justify-center transition"
      title={`Switch theme (current: ${theme})`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="text-redMain text-sm" />
      </motion.div>
    </motion.button>
  );
}
