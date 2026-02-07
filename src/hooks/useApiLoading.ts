import { useState } from "react";

export const useApiLoading = () => {
  const [loading, setLoading] = useState(false);

  const run = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  return { loading, run };
};
