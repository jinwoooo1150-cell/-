import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

type GuideCard = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
};

const guideCards: GuideCard[] = [
  {
    key: "genre",
    title: "갈래별 탭 사용법",
    subtitle: "작품 탐색부터 문제 풀이까지",
    icon: "layers-outline",
    color: "#0EA5E9",
    route: "/guide/genre",
  },
  {
    key: "ox",
    title: "O/X 문제 사용법",
    subtitle: "정답 판정과 해설 확인 흐름",
    icon: "checkmark-done-outline",
    color: "#10B981",
    route: "/guide/ox",
  },
  {
    key: "classic-poetry",
    title: "고전시가 퀴즈 사용법",
    subtitle: "어휘 테스트와 갈래 학습 연결",
    icon: "leaf-outline",
    color: "#D4A017",
    route: "/guide/classic-poetry",
  },
  {
    key: "bookmark",
    title: "북마크 기능 사용법",
    subtitle: "저장 · 필터 · 삭제 · 복습",
    icon: "bookmark-outline",
    color: "#3B82F6",
    route: "/guide/bookmark",
  },
];

export default function GuideHomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12,
            borderBottomColor: theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Suo 사용법</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              (Platform.OS === "web" ? webBottomInset : insets.bottom) + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>빠른 가이드</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>카드형 메뉴에서 원하는 주제를 선택하세요.</Text>

        <View style={styles.cardList}>
          {guideCards.map((card, index) => (
            <Animated.View
              key={card.key}
              entering={FadeInDown.delay(index * 80).duration(350)}
            >
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(card.route as any);
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={[styles.cardIconBox, { backgroundColor: card.color }]}> 
                  <Ionicons name={card.icon} size={22} color="#FFF" />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{card.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textMuted}
                />
              </Pressable>
            </Animated.View>
          ))}
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 20,
  },
  sectionSubtitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    marginBottom: 8,
  },
  cardList: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 15,
  },
  cardSubtitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
  },
});
