// src/components/Offline/OfflineScreen.tsx
import { WiDaySunny } from "react-icons/wi";
import { AiOutlineReload } from "react-icons/ai";

const OfflineScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <WiDaySunny size={64} className="text-yellow-400 mb-4 animate-bounce" />
    <h1 className="text-2xl font-bold mb-2 text-center">No Internet Connection</h1>
    <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
      Your app is offline. Please check your connection and try again.
    </p>
    
    {/* Retry using icon */}
    <AiOutlineReload
      size={40}
      className="text-blue-600 dark:text-blue-400 cursor-pointer hover:rotate-12 transition-transform duration-300"
      onClick={() => window.location.reload()}
      title="Retry"
    />
  </div>
);

export default OfflineScreen;
