import Colors from "@/constants/colors";
import { ThemeMode } from "@/contexts/StudyContext";

export function resolveTheme(_mode: ThemeMode) {
  return Colors.light;
}

export function getThemeLabel(mode: ThemeMode) {
  if (mode === "light") return "라이트";
  return "라이트";
}

export function useAppTheme() {
  return Colors.light;
}
