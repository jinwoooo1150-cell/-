import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function GuideGenreScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12, borderBottomColor: theme.border, backgroundColor: theme.card }]}> 
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>갈래별 탭 사용법</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}>
        <Text style={[styles.title, { color: theme.text }]}>이렇게 시작하세요</Text>
        {[
          "학습 탭에서 '문학 갈래별 학습'으로 이동",
          "원하는 갈래(현대시/고전시가 등)를 선택",
          "작품 목록에서 학습할 작품을 선택",
          "작품의 O/X 문제를 풀고 결과를 확인",
        ].map((step, idx) => (
          <View key={step} style={[styles.stepCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{idx + 1}</Text></View>
            <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/study/categories" as any);
          }}
          style={[styles.cta, { backgroundColor: theme.tint }]}
        >
          <Text style={styles.ctaText}>갈래별 학습 바로가기</Text>
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
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
  title: { fontFamily: "NotoSansKR_700Bold", fontSize: 20, marginBottom: 4 },
  stepCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#FFF", fontFamily: "NotoSansKR_700Bold", fontSize: 12 },
  stepText: { flex: 1, fontFamily: "NotoSansKR_500Medium", fontSize: 14, lineHeight: 20 },
  cta: {
    marginTop: 8,
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ctaText: { color: "#FFF", fontFamily: "NotoSansKR_700Bold", fontSize: 15 },
});
