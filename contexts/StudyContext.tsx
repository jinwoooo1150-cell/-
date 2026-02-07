import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SubCategory {
  id: string;
  name: string;
  icon: string;
  iconFamily: string;
  unlocked: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface StudyContextValue {
  dailyProgress: number;
  streak: number;
  totalXP: number;
  subCategories: SubCategory[];
  unlockCategory: (id: string) => void;
  addProgress: (id: string, amount: number) => void;
  getDDay: () => number;
}

const StudyContext = createContext<StudyContextValue | null>(null);

const STORAGE_KEY = "suneung_study_data";

const TARGET_DATE = new Date(2026, 10, 12);

const defaultSubCategories: SubCategory[] = [
  {
    id: "modern-poetry",
    name: "현대시",
    icon: "flower-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0.35,
    totalLessons: 20,
    completedLessons: 7,
  },
  {
    id: "modern-novel",
    name: "현대소설",
    icon: "book-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0.15,
    totalLessons: 25,
    completedLessons: 4,
  },
  {
    id: "classic-poetry",
    name: "고전시가",
    icon: "leaf-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
  },
  {
    id: "classic-novel",
    name: "고전소설",
    icon: "library-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0,
    totalLessons: 22,
    completedLessons: 0,
  },
];

export function StudyProvider({ children }: { children: ReactNode }) {
  const [dailyProgress, setDailyProgress] = useState(0.4);
  const [streak, setStreak] = useState(7);
  const [totalXP] = useState(0);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(defaultSubCategories);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.dailyProgress !== undefined) setDailyProgress(data.dailyProgress);
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.totalXP !== undefined) setTotalXP(data.totalXP);
        if (data.subCategories) setSubCategories(data.subCategories);
      }
    } catch (e) {
      console.log("Failed to load study data");
    }
  };

  const saveData = async (data: {
    dailyProgress: number;
    streak: number;
    totalXP: number;
    subCategories: SubCategory[];
  }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log("Failed to save study data");
    }
  };

  const unlockCategory = (id: string) => {
    setSubCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.id === id ? { ...cat, unlocked: true } : cat
      );
      saveData({ dailyProgress, streak, totalXP, subCategories: updated });
      return updated;
    });
  };

  const addProgress = (id: string, amount: number) => {
    setSubCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.id !== id) return cat;
        const newCompleted = Math.min(cat.completedLessons + 1, cat.totalLessons);
        return {
          ...cat,
          progress: Math.min(cat.progress + amount, 1),
          completedLessons: newCompleted,
        };
      });
      const newDaily = Math.min(dailyProgress + amount * 0.5, 1);
      const newXP = totalXP + Math.round(amount * 100);
      setDailyProgress(newDaily);
      setTotalXP(newXP);
      saveData({ dailyProgress: newDaily, streak, totalXP: newXP, subCategories: updated });
      return updated;
    });
  };

  const getDDay = () => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const value = useMemo(
    () => ({
      dailyProgress,
      streak,
      totalXP,
      subCategories,
      unlockCategory,
      addProgress,
      getDDay,
    }),
    [dailyProgress, streak, totalXP, subCategories]
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within StudyProvider");
  }
  return context;
}
