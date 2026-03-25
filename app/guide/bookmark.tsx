import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function GuideBookmarkScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12, borderBottomColor: theme.border, backgroundColor: theme.card }]}> 
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>북마크 기능 사용법</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}>
        {[
          "퀴즈 화면에서 북마크 아이콘을 눌러 문제를 저장해요.",
          "저장한 문제는 홈/학습 경로에서 북마크 화면으로 모아볼 수 있어요.",
          "북마크 화면에서 전체 · 문학 · 기출 필터로 빠르게 분류해요.",
          "필요 없는 문제는 삭제하고, 해설을 보며 복습해요.",
        ].map((line, idx) => (
          <View key={line} style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={styles.rowIndex}>{idx + 1}</Text>
            <Text style={[styles.rowText, { color: theme.text }]}>{line}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/study/bookmarks" as any);
          }}
          style={[styles.cta, { backgroundColor: theme.tint }]}
        >
          <Ionicons name="bookmark" size={16} color="#FFF" />
          <Text style={styles.ctaText}>북마크 바로가기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 18 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    color: "#FFF",
    fontFamily: "NotoSansKR_700Bold",
    backgroundColor: "#3B82F6",
    overflow: "hidden",
  },
  rowText: { flex: 1, fontFamily: "NotoSansKR_500Medium", fontSize: 14, lineHeight: 20 },
  cta: {
    marginTop: 8,
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaText: { color: "#FFF", fontFamily: "NotoSansKR_700Bold", fontSize: 15 },
});
