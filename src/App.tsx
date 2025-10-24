// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { MobileNavBar, NavBar } from "./components/navigation/Navbar";
import TopNav from "./components/navigation/TopNav";
import Footer from "./components/sections/Footer";
import { useEffect } from "react";
import "./index.css";

import { routes, documentRoutes, myDocumentsRoutes, type pageRouteConfig } from "./routes/pageRouteConfig";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import OfflineWrapper from "./components/Offline/OfflineWrapper";

// Simple Head component to replace react-helmet
const Head = ({ title, description }: { title: string; description?: string }) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description]);

  return null;
};

function App() {
  const allRoutes: pageRouteConfig[] = [...routes, ...documentRoutes, ...myDocumentsRoutes];
  const theme = useSelector((state: RootState) => state.ui.theme);
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  const filteredRoutes = allRoutes.filter((route) => {
    if (route.path === "/panel") return isAdmin;
    return true;
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "professional");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBARS */}
      <div className="fixed top-0 z-50 w-full">
        <TopNav />
        <div className="bg-redBg/30 dark:bg-grayBg/30 backdrop-blur-md">
          <MobileNavBar />
          <NavBar />
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full mt-20 transition-colors duration-300 bg-[var(--bg)] text-[var(--text)]">
        <OfflineWrapper>
          <Routes>
            {filteredRoutes.map((route) => {
              const Element = route.element;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <>
                      {route.seo && <Head title={route.seo.title} description={route.seo.description} />}
                      <Element />
                    </>
                  }
                />
              );
            })}
          </Routes>
        </OfflineWrapper>
      </main>

      {/* FOOTER */}
      {location.pathname !== "/create/cv" && <Footer />}
    </div>
  );
}

export default App;
