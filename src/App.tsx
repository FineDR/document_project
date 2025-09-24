import { Routes, Route, useLocation } from "react-router-dom";
import { MobileNavBar, NavBar } from "./components/navigation/Navbar";
import TopNav from "./components/navigation/TopNav";
import Footer from "./components/sections/Footer";
import "./index.css";

import { routes, documentRoutes, myDocumentsRoutes } from "./routes/pageRouteConfig"; 
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const allRoutes = [...routes, ...documentRoutes, ...myDocumentsRoutes];
  const location = useLocation(); // current path

  // Get logged-in user
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  // Filter routes: only include /panel if admin
  const filteredRoutes = allRoutes.filter((route) => {
    if (route.path === "/panel") return isAdmin; // show only for admin
    return true; // all other routes are accessible
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 z-50 w-full">
        <TopNav />
        <MobileNavBar />
        <NavBar />
      </div>

      <main className="flex-1 w-full px-4 mt-14">
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
