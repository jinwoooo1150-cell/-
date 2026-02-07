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
import { CheetahMascot } from "@/components/CheetahMascot";
import { ProgressBar } from "@/components/ProgressBar";
import { StudyCard } from "@/components/StudyCard";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { dailyProgress, streak, getDDay, completedWorks, learningTime, vocabProgress } = useStudy();
  const dDay = getDDay();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}초`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 20,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color={Colors.light.tint} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        <View style={styles.mascotSection}>
          <CheetahMascot size={90} />
        </View>

        <LinearGradient
          colors={[Colors.light.tint, Colors.light.tintDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ddayCard}
        >
          <View style={styles.ddayInner}>
            <Text style={styles.ddayLabel}>2027학년도 대수능</Text>
            <View style={styles.ddayCounterRow}>
              <Text style={styles.ddayPrefix}>D-</Text>
              <Text style={styles.ddayNumber}>{dDay}</Text>
            </View>
            <Text style={styles.ddayDate}>2026년 11월 12일 (목)</Text>
          </View>
        </LinearGradient>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>오늘의 학습</Text>
            <View style={styles.progressGoalBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.light.success} />
              <Text style={styles.progressGoalText}>
                {Math.round(dailyProgress * 100)}% 완료
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={dailyProgress}
            height={14}
            color={Colors.light.success}
          />
        </View>

        <View style={styles.studySection}>
          <Text style={styles.sectionTitle}>학습 시작하기</Text>
          <StudyCard
            title="문학"
            subtitle="현대시 · 현대소설 · 고전시가 · 고전소설"
            icon="book"
            onPress={() => router.push("/study/literature")}
            large
            color={Colors.light.tint}
          />
        </View>

        <View style={styles.studySection}>
          <Text style={styles.sectionTitle}>어휘 테스트</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/vocab-test");
            }}
            style={({ pressed }) => [
              styles.vocabCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <View style={styles.vocabCardLeft}>
              <View style={styles.vocabIconBox}>
                <Ionicons name="language" size={24} color="#FFF" />
              </View>
              <View style={styles.vocabInfo}>
                <Text style={styles.vocabTitle}>{vocabProgress.currentDay}일차 고전시가 어휘 테스트</Text>
                <Text style={styles.vocabProgress}>
                  {vocabProgress.learnedCount} / {vocabProgress.totalCount}
                </Text>
                <ProgressBar
                  progress={vocabProgress.totalCount > 0 ? vocabProgress.learnedCount / vocabProgress.totalCount : 0}
                  height={6}
                  color="#00B4D8"
                />
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={Colors.light.tint} />
            <Text style={styles.statValue}>{formatTime(learningTime)}</Text>
            <Text style={styles.statLabel}>오늘 학습</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={24} color={Colors.light.success} />
            <Text style={styles.statValue}>{completedWorks.length}</Text>
            <Text style={styles.statLabel}>완료 작품</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color="#F5A623" />
            <Text style={styles.statValue}>{streak}일</Text>
            <Text style={styles.statLabel}>연속 학습</Text>
          </View>
        </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  streakText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 15,
    color: Colors.light.tint,
  },
  mascotSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  ddayCard: {
    borderRadius: 22,
    marginBottom: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ddayInner: {
    padding: 28,
    alignItems: "center",
    gap: 6,
  },
  ddayLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
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
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  progressSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  progressGoalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressGoalText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: Colors.light.success,
  },
  studySection: {
    marginBottom: 24,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 20,
    color: Colors.light.text,
  },
  vocabCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  vocabCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  vocabIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#00B4D8",
    alignItems: "center",
    justifyContent: "center",
  },
  vocabInfo: {
    flex: 1,
    gap: 4,
  },
  vocabTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.text,
  },
  vocabProgress: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 18,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
});
