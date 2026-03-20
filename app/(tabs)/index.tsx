import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { CheetahMascot } from "@/components/CheetahMascot";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    dailyProgress,
    getDDay,
    completedWorks,
    subCategories,
    vocabProgress,
    isVocabCompletedToday,
  } = useStudy();
  const dDay = getDDay();
  const vocabDone = isVocabCompletedToday();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const completedLessons = subCategories.reduce((sum, c) => sum + c.completedLessons, 0);
  const todayProgress = Math.round(dailyProgress * 100);

  const vocabScale = useSharedValue(1);
  const vocabPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: vocabScale.value }],
  }));

  const studyScale = useSharedValue(1);
  const studyPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: studyScale.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>Suo</Text>
          <View style={styles.headerBadgeRow}>
            <View style={styles.xpBadge}>
              <Ionicons name="star" size={14} color="#FFB347" />
              <Text style={styles.xpText}>{completedLessons}</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTextGroup}>
            <Text style={styles.heroOverline}>오늘도 한 걸음</Text>
            <Text style={styles.heroTitle}>수오 공부법으로 오수를 면하자</Text>
          </View>
          <View style={styles.mascotSection}>
            <CheetahMascot size={120} mood="happy" />
          </View>
        </View>

        <LinearGradient
          colors={["#FF8C00", "#E07800", "#C86800"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ddayCard}
        >
          <View style={styles.ddayInner}>
            <Text style={styles.ddayLabel}>2027학년도 대학수학능력시험</Text>
            <View style={styles.ddayCounterRow}>
              <Text style={styles.ddayPrefix}>D-</Text>
              <Text style={styles.ddayNumber}>{dDay}</Text>
            </View>
            <Text style={styles.ddayDate}>2026년 11월 12일 (목)</Text>
          </View>
          <View style={styles.ddayDecorCircle1} />
          <View style={styles.ddayDecorCircle2} />
        </LinearGradient>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Pressable
            onPressIn={() => {
              if (!vocabDone) vocabScale.value = withSpring(0.97, { damping: 15 });
            }}
            onPressOut={() => {
              vocabScale.value = withSpring(1, { damping: 15 });
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (!vocabDone) {
                router.push("/study/vocab-test" as any);
              }
            }}
          >
            <Animated.View style={vocabPressStyle}>
              <LinearGradient
                colors={vocabDone ? ["#58CC02", "#46A302"] : ["#FF9640", "#FFB347"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.vocabCard}
              >
                <View style={styles.vocabCardContent}>
                  <View style={styles.vocabIconBox}>
                    <Ionicons name={vocabDone ? "checkmark-circle" : "sparkles"} size={28} color="#FFF" />
                  </View>
                  <View style={styles.vocabTextSection}>
                    <Text style={styles.vocabTitle}>오늘의 고전시가 어휘 테스트</Text>
                    <Text style={styles.vocabProgress}>
                      {vocabProgress.learnedCount} / {vocabProgress.totalCount} 어휘 학습
                    </Text>
                  </View>
                  {vocabDone ? (
                    <View style={styles.vocabCheckBadge}>
                      <Ionicons name="checkmark" size={22} color="#FFF" />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
                  )}
                </View>
                <View style={styles.vocabDecor1} />
                <View style={styles.vocabDecor2} />
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Animated.View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{todayProgress}%</Text>
              <Text style={styles.progressLabel}>오늘 진도</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{completedWorks.length}</Text>
              <Text style={styles.progressLabel}>완료 작품</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${todayProgress}%` }]} />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Pressable
            onPressIn={() => {
              studyScale.value = withSpring(0.97, { damping: 15 });
            }}
            onPressOut={() => {
              studyScale.value = withSpring(1, { damping: 15 });
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/categories" as any);
            }}
          >
            <Animated.View style={studyPressStyle}>
              <LinearGradient
                colors={["#FF8C00", "#FFB347"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.quickStartGradient}
              >
                <Ionicons name="play" size={22} color="#FFF" />
                <Text style={styles.quickStartText}>문학 학습 시작하기</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  appTitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 22,
    color: Colors.light.tint,
    letterSpacing: -0.3,
  },
  headerBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  xpText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: "#FFB347",
  },
  heroCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTextGroup: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  heroOverline: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  heroTitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 17,
    lineHeight: 22,
    color: Colors.light.text,
  },
  heroDescription: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    lineHeight: 17,
    color: Colors.light.textSecondary,
  },
  mascotSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  ddayCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ddayInner: {
    padding: 28,
    alignItems: "center",
    gap: 4,
  },
  ddayLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
  },
  ddayCounterRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ddayPrefix: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 36,
    color: "#FFF",
  },
  ddayNumber: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 56,
    color: "#FFF",
    lineHeight: 64,
  },
  ddayDate: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },
  ddayDecorCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  ddayDecorCircle2: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  vocabCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  vocabCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 14,
  },
  vocabIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  vocabTextSection: {
    flex: 1,
    gap: 3,
  },
  vocabTitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    color: "#FFF",
  },
  vocabProgress: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  vocabCheckBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  vocabDecor1: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  vocabDecor2: {
    position: "absolute",
    bottom: -8,
    left: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  progressCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  progressDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  progressValue: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 20,
    color: Colors.light.tint,
  },
  progressLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  progressTrack: {
    marginTop: 14,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#F3EFE8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.tint,
    borderRadius: 999,
  },
  quickStartGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
    borderRadius: 18,
    overflow: "hidden",
  },
  quickStartText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 17,
    color: "#FFF",
  },
});
