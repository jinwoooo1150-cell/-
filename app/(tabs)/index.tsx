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
    streak,
    getDDay,
    completedWorks,
    subCategories,
    vocabProgress,
    isVocabCompletedToday,
    learningTime,
  } = useStudy();
  const dDay = getDDay();
  const vocabDone = isVocabCompletedToday();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const completedLessons = subCategories.reduce((sum, c) => sum + c.completedLessons, 0);

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
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color={Colors.light.tint} />
            <Text style={styles.streakText}>{streak}일</Text>
          </View>
          <Text style={styles.appTitle}>Su-o-lingo</Text>
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={16} color="#FFB347" />
            <Text style={styles.xpText}>{completedLessons}</Text>
          </View>
        </View>

        <View style={styles.mascotSection}>
          <CheetahMascot size={80} mood="happy" />
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
                colors={vocabDone ? ["#58CC02", "#46A302"] : ["#FF8C00", "#FFB347"]}
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
              <Text style={styles.progressValue}>{Math.round(dailyProgress * 100)}%</Text>
              <Text style={styles.progressLabel}>오늘 진도</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{completedWorks.length}</Text>
              <Text style={styles.progressLabel}>완료 작품</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{streak}일</Text>
              <Text style={styles.progressLabel}>연속 학습</Text>
            </View>
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
    marginBottom: 8,
  },
  appTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.tint,
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  streakText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.tint,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  xpText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: "#FFB347",
  },
  mascotSection: {
    alignItems: "center",
    marginVertical: 4,
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
    fontFamily: "NotoSansKR_900Black",
    fontSize: 36,
    color: "#FFF",
  },
  ddayNumber: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 56,
    color: "#FFF",
    lineHeight: 64,
  },
  ddayDate: {
    fontFamily: "NotoSansKR_400Regular",
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
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: "#FFF",
  },
  vocabProgress: {
    fontFamily: "NotoSansKR_400Regular",
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
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.tint,
  },
  progressLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
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
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: "#FFF",
  },
});
