import { Routes, Route, useLocation } from "react-router-dom";
import { MobileNavBar, NavBar } from "./components/navigation/Navbar";
import TopNav from "./components/navigation/TopNav";
import Footer from "./components/sections/Footer";
import { useEffect } from "react";
import "./index.css";

import { routes, documentRoutes, myDocumentsRoutes } from "./routes/pageRouteConfig";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const allRoutes = [...routes, ...documentRoutes, ...myDocumentsRoutes];
  const theme = useSelector((state: RootState) => state.ui.theme);
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  const filteredRoutes = allRoutes.filter((route) => {
    if (route.path === "/panel") return isAdmin;
    return true;
  });

  // ✅ Apply theme class to <html> only
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "professional");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 z-50 w-full">
        <TopNav />
        <div className="bg-redBg/30 dark:bg-grayBg/30 backdrop-blur-md">
          <MobileNavBar />
          <NavBar />
        </div>
      </div>

      <main
        className="flex-1 w-full px-4 mt-20 transition-colors duration-300 bg-[var(--bg)] text-[var(--text)]"
      >
        <Routes>
          {filteredRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
        </Routes>
      </main>

      {location.pathname !== "/create/cv" && <Footer />}
    </div>
  );
}

export default App;
