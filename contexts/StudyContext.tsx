import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from "react";
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

export type NoteType = "literature" | "vocab" | "exam";

export interface IncorrectNote {
  questionId: string;
  quizId: string;
  quizTitle: string;
  quizAuthor: string;
  categoryId: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  userAnswer: string;
  correctAnswer?: string;
  sourceTitle?: string;
  noteType?: NoteType;
  timestamp: number;
}

export interface BookmarkItem {
  questionId: string;
  quizId: string;
  quizTitle: string;
  quizAuthor: string;
  categoryId: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  sourceTitle?: string;
  noteType?: NoteType;
  timestamp: number;
}

export interface VocabProgress {
  learnedCount: number;
  allLearnedIds: string[];
  dailyQuestionCount: number;
  dailyCorrectCount: number;
  lastGeneratedDate: string | null;
  lastCompletedDate: string | null;
  lastSetQuestionIds: string[];
  dailyCompletedIds: string[];
}

interface StudyContextValue {
  dailyProgress: number;
  streak: number;
  subCategories: SubCategory[];
  completedWorks: string[];
  incorrectNotes: IncorrectNote[];
  bookmarks: BookmarkItem[];
  learningTime: number;
  vocabProgress: VocabProgress;
  unlockCategory: (id: string) => void;
  addProgress: (id: string, amount: number) => void;
  getDDay: () => number;
  addCompletedWork: (workId: string) => void;
  addIncorrectNote: (note: IncorrectNote) => void;
  removeIncorrectNote: (questionId: string) => void;
  addBookmark: (bookmark: BookmarkItem) => void;
  removeBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  addLearningTime: (seconds: number) => void;
  updateVocabProgress: (learnedId: string, questionIds?: string[]) => void;
  markVocabCompleted: (questionIds?: string[]) => void;
  isVocabCompletedToday: (questionIds?: string[]) => boolean;
  resetDailyLearningTime: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

const STORAGE_KEY = "suneung_study_data";
const INCORRECTS_KEY = "suneung_incorrects";
const BOOKMARKS_KEY = "suneung_bookmarks";
const COMPLETED_KEY = "suneung_completed_works";
const LEARNING_TIME_KEY = "suneung_learning_time";
const LEGACY_VOCAB_KEY = "suneung_vocab_progress";
const VOCAB_KEY = "suneung_vocab_progress_v2";

const TARGET_DATE = new Date(2026, 10, 12);

const defaultSubCategories: SubCategory[] = [
  {
    id: "modern-poetry",
    name: "현대시",
    icon: "flower-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
  },
  {
    id: "modern-novel",
    name: "현대소설",
    icon: "book-outline",
    iconFamily: "Ionicons",
    unlocked: true,
    progress: 0,
    totalLessons: 25,
    completedLessons: 0,
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

const defaultVocabProgress: VocabProgress = {
  learnedCount: 0,
  allLearnedIds: [],
  dailyQuestionCount: 0,
  dailyCorrectCount: 0,
  lastGeneratedDate: null,
  lastCompletedDate: null,
  lastSetQuestionIds: [],
  dailyCompletedIds: [],
};

const getTodayKey = () => new Date().toDateString();

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const ensureDailySet = (prev: VocabProgress, questionIds: string[] = []): VocabProgress => {
  const today = getTodayKey();
  const normalizedIds = [...new Set(questionIds)];
  const hasSetChanged =
    normalizedIds.length > 0
    && normalizedIds.join("|") !== prev.lastSetQuestionIds.join("|");
  const isNewDay = prev.lastGeneratedDate !== today;

  if (!isNewDay && !hasSetChanged) {
    if (normalizedIds.length > 0 && prev.dailyQuestionCount !== normalizedIds.length) {
      return {
        ...prev,
        dailyQuestionCount: normalizedIds.length,
      };
    }
    return prev;
  }

  return {
    ...prev,
    dailyQuestionCount: normalizedIds.length,
    dailyCorrectCount: 0,
    dailyCompletedIds: [],
    lastGeneratedDate: today,
    lastSetQuestionIds: normalizedIds,
    lastCompletedDate: isNewDay ? null : prev.lastCompletedDate,
  };
};

const migrateVocabProgress = (raw: any): VocabProgress => {
  if (!raw || typeof raw !== "object") return defaultVocabProgress;
  if (Array.isArray(raw.allLearnedIds)) {
    const normalizedAllLearnedIds = [...new Set(toStringArray(raw.allLearnedIds))];
    const safeDailyQuestionCount = typeof raw.dailyQuestionCount === "number" ? Math.max(raw.dailyQuestionCount, 0) : 0;
    const safeDailyCorrectCount = typeof raw.dailyCorrectCount === "number" ? Math.max(raw.dailyCorrectCount, 0) : 0;
    return {
      ...defaultVocabProgress,
      ...raw,
      learnedCount: typeof raw.learnedCount === "number" ? Math.max(raw.learnedCount, normalizedAllLearnedIds.length) : normalizedAllLearnedIds.length,
      allLearnedIds: normalizedAllLearnedIds,
      lastSetQuestionIds: toStringArray(raw.lastSetQuestionIds),
      dailyCompletedIds: toStringArray(raw.dailyCompletedIds),
      dailyQuestionCount: safeDailyQuestionCount,
      dailyCorrectCount: Math.min(safeDailyCorrectCount, safeDailyQuestionCount),
    };
  }

  const legacyCompletedIds = toStringArray(raw.completedIds);
  const normalizedLegacyLearnedIds = [...new Set(legacyCompletedIds)];
  return {
    learnedCount: typeof raw.learnedCount === "number" ? Math.max(raw.learnedCount, normalizedLegacyLearnedIds.length) : normalizedLegacyLearnedIds.length,
    allLearnedIds: normalizedLegacyLearnedIds,
    dailyQuestionCount: 0,
    dailyCorrectCount: 0,
    lastGeneratedDate: null,
    lastCompletedDate: raw.completedDate ?? null,
    lastSetQuestionIds: [],
    dailyCompletedIds: [],
  };
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [dailyProgress, setDailyProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(defaultSubCategories);
  const [completedWorks, setCompletedWorks] = useState<string[]>([]);
  const [incorrectNotes, setIncorrectNotes] = useState<IncorrectNote[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [learningTime, setLearningTime] = useState(0);
  const [vocabProgress, setVocabProgress] = useState<VocabProgress>(defaultVocabProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [studyData, incorrectsData, bookmarksData, completedData, timeData, vocabData, legacyVocabData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(INCORRECTS_KEY),
        AsyncStorage.getItem(BOOKMARKS_KEY),
        AsyncStorage.getItem(COMPLETED_KEY),
        AsyncStorage.getItem(LEARNING_TIME_KEY),
        AsyncStorage.getItem(VOCAB_KEY),
        AsyncStorage.getItem(LEGACY_VOCAB_KEY),
      ]);

      if (studyData) {
        const data = JSON.parse(studyData);
        if (data.dailyProgress !== undefined) setDailyProgress(data.dailyProgress);
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.subCategories) setSubCategories(data.subCategories);
      }
      if (incorrectsData) setIncorrectNotes(JSON.parse(incorrectsData));
      if (bookmarksData) setBookmarks(JSON.parse(bookmarksData));
      if (completedData) setCompletedWorks(JSON.parse(completedData));
      if (timeData) {
        const parsed = JSON.parse(timeData);
        const today = new Date().toDateString();
        if (parsed.date === today) {
          setLearningTime(parsed.seconds);
        }
      }
      const parsedVocabData = vocabData ? JSON.parse(vocabData) : legacyVocabData ? JSON.parse(legacyVocabData) : null;
      if (parsedVocabData) {
        const migrated = migrateVocabProgress(parsedVocabData);
        setVocabProgress(migrated);
        await AsyncStorage.setItem(VOCAB_KEY, JSON.stringify(migrated));
        if (legacyVocabData) {
          await AsyncStorage.removeItem(LEGACY_VOCAB_KEY);
        }
      }

      setIsLoaded(true);
    } catch (e) {
      console.log("Failed to load study data");
      setIsLoaded(true);
    }
  };

  const saveStudyData = useCallback(async (data: {
    dailyProgress: number;
    streak: number;
    subCategories: SubCategory[];
  }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log("Failed to save study data");
    }
  }, []);

  const unlockCategory = useCallback((id: string) => {
    setSubCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.id === id ? { ...cat, unlocked: true } : cat
      );
      saveStudyData({ dailyProgress, streak, subCategories: updated });
      return updated;
    });
  }, [dailyProgress, streak, saveStudyData]);

  const addProgress = useCallback((id: string, amount: number) => {
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
      setDailyProgress(newDaily);
      saveStudyData({ dailyProgress: newDaily, streak, subCategories: updated });
      return updated;
    });
  }, [dailyProgress, streak, saveStudyData]);

  const getDDay = useCallback(() => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  const addCompletedWork = useCallback(async (workId: string) => {
    setCompletedWorks((prev) => {
      if (prev.includes(workId)) return prev;
      const updated = [...prev, workId];
      AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addIncorrectNote = useCallback(async (note: IncorrectNote) => {
    setIncorrectNotes((prev) => {
      const exists = prev.find((n) => n.questionId === note.questionId);
      const updated = exists
        ? prev.map((n) => (n.questionId === note.questionId ? note : n))
        : [...prev, note];
      AsyncStorage.setItem(INCORRECTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeIncorrectNote = useCallback(async (questionId: string) => {
    setIncorrectNotes((prev) => {
      const updated = prev.filter((n) => n.questionId !== questionId);
      AsyncStorage.setItem(INCORRECTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBookmark = useCallback(async (bookmark: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.questionId === bookmark.questionId);
      if (exists) return prev;
      const updated = [...prev, bookmark];
      AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeBookmark = useCallback(async (questionId: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.questionId !== questionId);
      AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((questionId: string) => {
    return bookmarks.some((b) => b.questionId === questionId);
  }, [bookmarks]);

  const addLearningTime = useCallback(async (seconds: number) => {
    setLearningTime((prev) => {
      const updated = prev + seconds;
      const today = new Date().toDateString();
      AsyncStorage.setItem(LEARNING_TIME_KEY, JSON.stringify({ date: today, seconds: updated }));
      return updated;
    });
  }, []);

  const resetDailyLearningTime = useCallback(async () => {
    setLearningTime(0);
    const today = new Date().toDateString();
    await AsyncStorage.setItem(LEARNING_TIME_KEY, JSON.stringify({ date: today, seconds: 0 }));
  }, []);

  const updateVocabProgress = useCallback(async (learnedId: string, questionIds: string[] = []) => {
    setVocabProgress((prev) => {
      const base = ensureDailySet(prev, questionIds);
      if (base.dailyCompletedIds.includes(learnedId)) return base;
      const hasLearned = base.allLearnedIds.includes(learnedId);
      const updated = {
        ...base,
        learnedCount: hasLearned ? base.learnedCount : base.learnedCount + 1,
        allLearnedIds: hasLearned ? base.allLearnedIds : [...base.allLearnedIds, learnedId],
        dailyCorrectCount: Math.min(base.dailyCorrectCount + 1, base.dailyQuestionCount),
        dailyCompletedIds: [...base.dailyCompletedIds, learnedId],
      };
      AsyncStorage.setItem(VOCAB_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markVocabCompleted = useCallback(async (questionIds: string[] = []) => {
    const today = getTodayKey();
    setVocabProgress((prev) => {
      const base = ensureDailySet(prev, questionIds);
      const updated = { ...base, lastCompletedDate: today };
      AsyncStorage.setItem(VOCAB_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isVocabCompletedToday = useCallback((questionIds: string[] = []) => {
    const today = getTodayKey();
    const normalizedIds = [...new Set(questionIds)];
    const hasSameSet = normalizedIds.length === 0
      ? true
      : normalizedIds.join("|") === vocabProgress.lastSetQuestionIds.join("|");
    return vocabProgress.lastCompletedDate === today && hasSameSet;
  }, [vocabProgress.lastCompletedDate, vocabProgress.lastSetQuestionIds]);

  const value = useMemo(
    () => ({
      dailyProgress,
      streak,
      subCategories,
      completedWorks,
      incorrectNotes,
      bookmarks,
      learningTime,
      vocabProgress,
      unlockCategory,
      addProgress,
      getDDay,
      addCompletedWork,
      addIncorrectNote,
      removeIncorrectNote,
      addBookmark,
      removeBookmark,
      isBookmarked,
      addLearningTime,
      updateVocabProgress,
      markVocabCompleted,
      isVocabCompletedToday,
      resetDailyLearningTime,
    }),
    [dailyProgress, streak, subCategories, completedWorks, incorrectNotes, bookmarks, learningTime, vocabProgress, unlockCategory, addProgress, getDDay, addCompletedWork, addIncorrectNote, removeIncorrectNote, addBookmark, removeBookmark, isBookmarked, addLearningTime, updateVocabProgress, markVocabCompleted, isVocabCompletedToday, resetDailyLearningTime]
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
