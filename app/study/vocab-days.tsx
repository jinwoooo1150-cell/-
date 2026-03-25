import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useStudy } from "@/contexts/StudyContext";
import { classicPoetryVocab } from "@/data/vocabData";
import { getTotalDays } from "@/lib/vocab/generateDaySet";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const TOTAL_DAYS = 40;

export default function VocabDaysScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isVocabDayCompleted, completedVocabDays } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const totalDays = useMemo(
    () => Math.max(getTotalDays(classicPoetryVocab), TOTAL_DAYS),
    []
  );

  const completedCount = completedVocabDays.length;

  const handleDayPress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/study/vocab-test",
      params: { day: String(day) },
    } as any);
  };

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop:
              (Platform.OS === "web" ? webTopInset : insets.top) + 12,
            borderBottomColor: theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            고전시가 어휘 테스트
          </Text>
          <Text style={[styles.headerSub, { color: theme.textMuted }]}>
            40일 완성 커리큘럼
          </Text>
        </View>
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
        <Animated.View
          entering={
            Platform.OS !== "web" ? FadeInDown.duration(350) : undefined
          }
          style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={styles.progressHeader}>
            <Ionicons name="trophy" size={20} color={Colors.light.tint} />
            <Text style={[styles.progressTitle, { color: theme.text }]}>
              진행 현황
            </Text>
          </View>
          <View style={styles.progressBarRow}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round((completedCount / totalDays) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressFraction, { color: theme.text }]}>
              {completedCount}/{totalDays}
            </Text>
          </View>
          <Text style={[styles.progressHint, { color: theme.textMuted }]}>
            {completedCount === 0
              ? "1일차부터 시작해 보세요!"
              : completedCount === totalDays
                ? "모든 일차를 완료했어요! 🎉"
                : `${totalDays - completedCount}일 남았어요`}
          </Text>
        </Animated.View>

        <View style={styles.gridContainer}>
          {days.map((day, idx) => {
            const done = isVocabDayCompleted(day);
            return (
              <Animated.View
                key={day}
                entering={
                  Platform.OS !== "web"
                    ? FadeInDown.delay(Math.min(idx * 20, 300)).duration(300)
                    : undefined
                }
                style={styles.gridItemWrapper}
              >
                <Pressable
                  onPress={() => handleDayPress(day)}
                  style={({ pressed }) => [
                    styles.dayTile,
                    done
                      ? styles.dayTileDone
                      : [styles.dayTileDefault, { backgroundColor: theme.card, borderColor: theme.border }],
                    pressed && styles.dayTilePressed,
                  ]}
                >
                  {done ? (
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                  ) : (
                    <Text style={[styles.dayNumber, { color: theme.text }]}>
                      {day}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.dayLabel,
                      done ? styles.dayLabelDone : { color: theme.textMuted },
                    ]}
                  >
                    일차
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerCenter: {
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
  },
  headerSub: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  progressCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
  },
  progressBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.tint,
    borderRadius: 999,
  },
  progressFraction: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.tint,
    minWidth: 44,
    textAlign: "right",
  },
  progressHint: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItemWrapper: {
    width: "22%",
  },
  dayTile: {
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1.5,
  },
  dayTileDone: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  dayTileDefault: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dayTilePressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },
  dayNumber: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    lineHeight: 22,
  },
  dayLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 10,
  },
  dayLabelDone: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
  },
});
