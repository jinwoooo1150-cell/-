import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import {
  useFonts,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
  NotoSansKR_900Black,
} from "@expo-google-fonts/noto-sans-kr";
import { StudyProvider, useStudy } from "@/contexts/StudyContext";
import { SplashOverlay } from "@/components/SplashOverlay";
import { resolveTheme } from "@/hooks/useAppTheme";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="study/literature" options={{ headerShown: false }} />
      <Stack.Screen name="study/categories" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="study/works" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="study/quiz/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="study/quiz/result" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="study/incorrects" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="study/bookmarks" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="study/vocab-test" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="guide/index" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="guide/genre" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="guide/ox" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="guide/classic-poetry" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="guide/bookmark" options={{ headerShown: false, animation: "slide_from_right" }} />
    </Stack>
  );
}

function AppShell() {
  const systemScheme = useColorScheme();
  const { themeMode } = useStudy();
  const theme = resolveTheme(themeMode, systemScheme);

  return (
    <>
      <StatusBar style={theme.background === "#121212" ? "light" : "dark"} />
      <RootLayoutNav />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
    NotoSansKR_900Black,
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <StudyProvider>
              {showSplash && <SplashOverlay onFinish={() => setShowSplash(false)} />}
              <AppShell />
            </StudyProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
