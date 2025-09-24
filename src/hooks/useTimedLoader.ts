/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTimedLoader.ts
import { useState } from "react";

export const useTimedLoader = (minTime = 2000) => {
  const [loading, setLoading] = useState(false);

  const withLoader = async (asyncFn: () => Promise<any>) => {
    const startTime = Date.now();
    setLoading(true);

    try {
      const result = await asyncFn();

      // Ensure loader stays visible for at least minTime
      const elapsed = Date.now() - startTime;
      const remaining = minTime - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      return result;
    // eslint-disable-next-line no-useless-catch
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, withLoader, setLoading };
};
