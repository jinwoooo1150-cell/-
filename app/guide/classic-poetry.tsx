import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function GuideClassicPoetryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12, borderBottomColor: theme.border, backgroundColor: theme.card }]}> 
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>고전시가 퀴즈 사용법</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}>
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.text }]}>1) 어휘 테스트로 시작</Text>
          <Text style={[styles.sectionText, { color: theme.textMuted }]}>홈에서 오늘의 고전시가 어휘 테스트를 통해 핵심 어휘를 먼저 익혀요.</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.sectionTitle, { color: theme.text }]}>2) 갈래별 학습에서 고전시가 선택</Text>
          <Text style={[styles.sectionText, { color: theme.textMuted }]}>학습 탭의 갈래 카드에서 고전시가를 선택하고 작품별 O/X 문제를 풀어요.</Text>
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/vocab-days");
            }}
            style={[styles.secondaryCta, { borderColor: theme.border, backgroundColor: theme.card }]}
          >
            <Text style={[styles.secondaryCtaText, { color: theme.text }]}>어휘 테스트</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: "/study/works", params: { categoryId: "classic-poetry" } } as any);
            }}
            style={[styles.primaryCta, { backgroundColor: theme.tint }]}
          >
            <Text style={styles.primaryCtaText}>고전시가 작품 보기</Text>
          </Pressable>
        </View>
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
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  sectionTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 15 },
  sectionText: { fontFamily: "NotoSansKR_500Medium", fontSize: 14, lineHeight: 20 },
  ctaRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  secondaryCta: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCtaText: { fontFamily: "NotoSansKR_700Bold", fontSize: 14 },
  primaryCta: {
    flex: 1.4,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCtaText: { color: "#FFF", fontFamily: "NotoSansKR_700Bold", fontSize: 14 },
});
