import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { clearSelected } from "../../features/auth/authSlice";
import { type RootState } from "../../store/store";
import ThemeToggle from "../common/ThemeToggle";


const TopNav = () => {
  const dispatch = useAppDispatch();
  const { user, selectedUser } = useSelector((state: RootState) => state.auth);
  const [signInIsOpen, setSignIn] = useState(false);
  const [signUpIsOpen, setSignUp] = useState(false);

  const token = localStorage.getItem("token");
  const isSignedIn = !!user && !!token;

  useEffect(() => {
    if (selectedUser) {
      setSignUp(true);
      dispatch(clearSelected());
    }
  }, [selectedUser, dispatch]);



  return (
    <div className="w-full">
      <div className="container mx-auto bg-background/50 dark:bg-bg backdrop-blur-md">
        <div className="flex justify-end items-center h-12 px-4">
       
          <ThemeToggle />
        </div>
      </div>

      
    </div>
  );
};

export default TopNav;
