import { useColorScheme } from "react-native";
import Colors from "@/constants/colors";
import { ThemeMode, useStudy } from "@/contexts/StudyContext";

export function resolveTheme(mode: ThemeMode, systemScheme?: "light" | "dark" | null) {
  if (mode === "system") {
    return systemScheme === "dark" ? Colors.dark : Colors.light;
  }
  return mode === "dark" ? Colors.dark : Colors.light;
}

export function getThemeLabel(mode: ThemeMode) {
  if (mode === "light") return "라이트";
  if (mode === "dark") return "다크";
  return "자동";
}

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const { themeMode } = useStudy();
  return resolveTheme(themeMode, systemScheme);
}
