/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Based on Consensus brand guidelines.
 */

const tintColorLight = "#7B3AED"; // Brand purple
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#000000", // Brand black
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  // Brand colors from guidelines
  brand: {
    primary: "#7B3AED", // Primary purple
    black: "#000000", // Brand black
    white: "#FFFFFF", // Brand white
    gradient: {
      start: "#7B3AED",
      end: "#9F70FD", // Lighter purple for gradients
    },
  },
};
