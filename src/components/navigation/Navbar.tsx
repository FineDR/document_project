import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiMenuLine } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";
import { DropdownMenu } from "./DropdownMenu";
import { Logo } from "./Logo";
import { routes } from "../../routes/pageRouteConfig";
import type { RootState } from "../../store/store";

export const NavBar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  return (
    <div className="w-full">
      <nav className="hidden md:flex container mx-auto px-6 py-3 justify-between items-center">
        <div className="text-2xl text-text bg-redBg/30 dark:bg-grayBg/30 backdrop-blur-md">
          <Logo />
        </div>
        <ul className="flex gap-8 items-center">
          {routes
            .filter((link) => link.forNav)
            .filter((link) => !(user && (link.path === "/signin" || link.path === "/signup")))
            .filter((link) => !link.signedIn || user)
            .map((link) => {
              if (link.path === "/panel" && !isAdmin) return null;

              const activeDropdownItems = link.dropdown?.filter((item) => item.active) || [];
              if (activeDropdownItems.length > 0) {
                return <DropdownMenu key={link.name} title={link.name} items={activeDropdownItems} />;
              }

              if (!link.dropdown) {
                return (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-text dark:text-text text-lg transition"
                          : "text-primary text-lg hover:text-redMain transition"
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
            .filter((r) => !(user && (r.path === "/signin" || r.path === "/signup")))
            .filter((r) => !r.signedIn || user)
            .map((r) => (
              <li key={r.name}>
                <Link
                  to={r.path}
                  className="bg-redMain text-white font-semibold px-6 py-2 rounded-full hover:bg-redMain hover:border-redMain/50 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {r.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.is_staff || user?.is_superuser;

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="md:hidden px-4 py-3 bg-background text-text">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-primary">
          <Logo />
        </div>
        <button
          onClick={handleToggle}
          className="text-primary text-3xl focus:outline-none p-2 rounded-full transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <TfiClose /> : <RiMenuLine />}
        </button>
      </div>

      {isOpen && (
        <ul className="flex flex-col items-start gap-4 mt-4 pb-4">
          {routes
            .filter((link) => link.forNav)
            // hide Sign In / Sign Up if user is logged in
            .filter((link) => !(user && (link.path === "/signin" || link.path === "/signup")))
            .filter((link) => !link.signedIn || user)
            .map((link) => {
              if (link.path === "/panel" && !isAdmin) return null;

              const activeDropdownItems = link.dropdown?.filter((item) => item.active) || [];
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
                          ? "text-text dark:text-text text-lg transition"
                          : "text-primary text-lg hover:text-redMain transition"
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
            // hide Sign In / Sign Up buttons if user is logged in
            .filter((r) => !(user && (r.path === "/signin" || r.path === "/signup")))
            .filter((r) => !r.signedIn || user)
            .map((r) => (
              <li key={r.name} className="w-full mt-2">
                <Link
                  to={r.path}
                  onClick={closeMenu}
                  className="bg-redMain text-white font-semibold px-6 py-3 rounded-full hover:bg-redMain hover:border-redMain/50 hover:shadow-lg transition duration-300 ease-in-out block w-full text-center"
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
