import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const SAMPLE_QUIZ_ID = "modern-poem-1";

export default function GuideOxScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12, borderBottomColor: theme.border, backgroundColor: theme.card }]}> 
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>O/X 문제 사용법</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]}>
        {[
          "문제를 읽고 하단 O 또는 X 버튼을 눌러 답을 선택해요.",
          "선택 즉시 정답/오답이 표시되고 해설이 열려요.",
          "틀린 문제는 자동으로 오답노트에 저장돼요.",
          "북마크 아이콘으로 중요한 문제를 따로 저장할 수 있어요.",
        ].map((line, idx) => (
          <View key={line} style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="checkmark-circle" size={18} color={idx < 2 ? "#10B981" : "#3B82F6"} />
            <Text style={[styles.tipText, { color: theme.text }]}>{line}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({ pathname: "/study/quiz/[id]", params: { id: SAMPLE_QUIZ_ID } } as any);
          }}
          style={[styles.cta, { backgroundColor: theme.tint }]}
        >
          <Text style={styles.ctaText}>O/X 퀴즈 바로 해보기</Text>
          <Ionicons name="play" size={16} color="#FFF" />
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
  tipCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: { flex: 1, fontFamily: "NotoSansKR_500Medium", fontSize: 14, lineHeight: 20 },
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
