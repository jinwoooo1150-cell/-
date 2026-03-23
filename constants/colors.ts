const orange = "#FF8C00";
const orangeLight = "#FFB347";
const orangeDark = "#E07800";
const orangeGlow = "#FFCF8A";
const cream = "#FFF8F0";
const warmWhite = "#FFFBF5";
const darkText = "#1A1A2E";
const mediumText = "#4A4A68";
const lightText = "#9090A7";
const cardBg = "#FFFFFF";
const lockedGray = "#E8E4EF";
const lockedText = "#B5B0C0";
const success = "#58CC02";
const successDark = "#46A302";

const light = {
  text: darkText,
  textSecondary: mediumText,
  textMuted: lightText,
  background: warmWhite,
  cream,
  tint: orange,
  tintLight: orangeLight,
  tintDark: orangeDark,
  tintGlow: orangeGlow,
  card: cardBg,
  tabIconDefault: lockedText,
  tabIconSelected: orange,
  locked: lockedGray,
  lockedText,
  success,
  successDark,
  border: "#F0EBE4",
  overlay: "rgba(26, 26, 46, 0.45)",
};

const dark = {
  text: "#F7F4EF",
  textSecondary: "#D7D1C5",
  textMuted: "#A59B8B",
  background: "#121212",
  cream: "#1B1B1F",
  tint: "#FFAA3B",
  tintLight: "#FFC77A",
  tintDark: "#D97A00",
  tintGlow: "rgba(255, 170, 59, 0.35)",
  card: "#1C1C21",
  tabIconDefault: "#7D7468",
  tabIconSelected: "#FFAA3B",
  locked: "#2A2A31",
  lockedText: "#7D7468",
  success,
  successDark,
  border: "#2F2F37",
  overlay: "rgba(0, 0, 0, 0.6)",
};

const Colors = { light, dark };

export type ThemeColors = typeof light;
export default Colors;
