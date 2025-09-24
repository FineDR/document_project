import { DropdownMenu } from "./DropdownMenu";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { useState } from "react";
import { RiMenu4Fill } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";
import { routes } from "../../routes/pageRouteConfig";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export const NavBar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;
  
  return (
    <nav className="hidden md:flex bg-red-50 shadow-md px-6 py-3 justify-between items-center p-8 border-b-2 border-red-200">
      <div className="text-2xl text-red-700">
        <Logo />
      </div>
      <ul className="flex gap-8 items-center">
        {routes
          .filter((link) => link.forNav)
          .map((link) => {
            // Only show /panel route for admins
            if (link.path === "/panel" && !isAdmin) return null;
            const activeDropdownItems =
              link.dropdown?.filter((item) => item.active) || [];
            if (activeDropdownItems.length > 0) {
              return (
                <DropdownMenu
                  key={link.name}
                  title={link.name}
                  items={activeDropdownItems}
                />
              );
            }
            if (!link.dropdown) {
              return (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 font-bold text-lg transition"
                        : "text-red-700 hover:text-red-500 font-medium transition"
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        {routes
          .filter((r) => r.showAsButton)
          .map((r) => (
            <li key={r.name}>
              <Link
                to={r.path}
                className="bg-red-600 text-white font-semibold px-6 py-2 rounded-full border-2 border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {r.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;
  
  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  return (
    <nav className="md:hidden bg-red-50 shadow-md px-4 py-3 border-b-2 border-red-200">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-red-700">
          <Logo />
        </div>
        <button
          onClick={handleToggle}
          className="text-red-600 text-3xl focus:outline-none p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <TfiClose /> : <RiMenu4Fill />}
        </button>
      </div>
      {isOpen && (
        <ul className="flex flex-col items-start gap-4 mt-4 pb-4">
          {routes
            .filter((link) => link.forNav)
            .map((link) => {
              if (link.path === "/panel" && !isAdmin) return null;
              const activeDropdownItems =
                link.dropdown?.filter((item) => item.active) || [];
              if (activeDropdownItems.length > 0) {
                return (
                  <DropdownMenu
                    key={link.name}
                    title={link.name}
                    items={activeDropdownItems}
                    onItemClick={closeMenu}
                  />
                );
              }
              if (!link.dropdown) {
                return (
                  <li key={link.name} className="w-full">
                    <NavLink
                      to={link.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-600 font-bold text-lg transition block w-full py-2 px-4 bg-red-100 rounded-lg"
                          : "text-red-700 hover:text-red-500 font-medium transition block w-full py-2 px-4 hover:bg-red-100 rounded-lg"
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                );
              }
              return null;
            })}
          {routes
            .filter((r) => r.showAsButton)
            .map((r) => (
              <li key={r.name} className="w-full mt-2">
                <Link
                  to={r.path}
                  onClick={closeMenu}
                  className="bg-red-600 text-white font-semibold px-6 py-3 rounded-full border-2 border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-lg transition duration-300 ease-in-out block w-full text-center"
                >
                  {r.name}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </nav>
  );
};