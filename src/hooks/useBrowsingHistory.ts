import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "browsing_history";
const MAX_HISTORY = 20;

type BrowsingHistoryItem = {
  productId: string;
  category: string;
  timestamp: number;
};

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState<BrowsingHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = useCallback((productId: string, category: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.productId !== productId);
      const updated = [
        { productId, category, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getViewedProductIds = useCallback(() => {
    return history.map((item) => item.productId);
  }, [history]);

  const getMostViewedCategories = useCallback(() => {
    const categoryCount: Record<string, number> = {};
    
    history.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
  }, [history]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    getViewedProductIds,
    getMostViewedCategories,
    clearHistory,
  };
};
