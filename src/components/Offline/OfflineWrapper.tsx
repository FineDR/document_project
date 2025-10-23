// src/components/Offline/OfflineWrapper.tsx
import { useEffect, useState, type ReactNode } from "react";
import OfflineScreen from "./OfflineScreen";

interface Props {
  children: ReactNode;
}

const OfflineWrapper = ({ children }: Props) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) return <OfflineScreen />;

  return <>{children}</>;
};

export default OfflineWrapper;
