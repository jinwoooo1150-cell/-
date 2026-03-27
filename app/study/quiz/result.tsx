import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { CheetahMascot } from "@/components/CheetahMascot";
import Colors from "@/constants/colors";

function ConfettiDot({ delay, x, color }: { delay: number; x: number; color: string }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withSequence(
        withSpring(-60, { damping: 4, stiffness: 100 }),
        withTiming(200, { duration: 2000 })
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * 3, { duration: 2500 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiDot,
        { left: x, backgroundColor: color },
        style,
      ]}
    />
  );
}

export default function QuizResultScreen() {
  const { title, total, results: resultsStr } = useLocalSearchParams<{
    quizId: string;
    title: string;
    total: string;
    results: string;
  }>();
  const insets = useSafeAreaInsets();

  const totalCount = parseInt(total || "0", 10);
  const resultsArr: boolean[] = resultsStr ? JSON.parse(resultsStr) : [];
  const correctCount = resultsArr.filter(Boolean).length;

  const mascotBounce = useSharedValue(0);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  useEffect(() => {
    if (correctCount === totalCount && totalCount > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    mascotBounce.value = withSequence(
      withSpring(1.15, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 6, stiffness: 150 })
    );
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotBounce.value }],
  }));

  const getMessage = () => {
    if (totalCount === 0) return "수고했어요!";
    if (correctCount === totalCount) return "완벽해요!";
    if (correctCount >= Math.ceil(totalCount * 0.7)) return "훌륭해요!";
    if (correctCount >= Math.ceil(totalCount * 0.4)) return "잘했어요!";
    return "다시 도전해요!";
  };

  const confettiColors = [Colors.light.tint, Colors.light.tintLight, Colors.light.success, "#FFD700", "#FF6B9D"];

  return (
    <View style={styles.container}>
      {correctCount === totalCount && totalCount > 0 &&
        Array.from({ length: 12 }).map((_, i) => (
          <ConfettiDot
            key={i}
            delay={i * 100}
            x={30 + (i * 28) % 320}
            color={confettiColors[i % confettiColors.length]}
          />
        ))}

      <View
        style={[
          styles.content,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 40,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
          },
        ]}
      >
        <Animated.View style={[styles.mascotWrapper, mascotStyle]}>
          <CheetahMascot size={100} />
        </Animated.View>

        <Animated.View
          entering={Platform.OS !== "web" ? FadeInDown.delay(200).springify() : undefined}
          style={styles.messageSection}
        >
          <Text style={styles.messageText}>{getMessage()}</Text>
          <Text style={styles.titleText}>{title}</Text>
        </Animated.View>

        <Animated.View
          entering={Platform.OS !== "web" ? FadeInDown.delay(400).springify() : undefined}
        >
          <LinearGradient
            colors={[Colors.light.tint, Colors.light.tintDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scoreCard}
          >
            <View style={styles.scoreSummaryRow}>
              <View style={styles.scoreSummaryIcon}>
                <Ionicons name="book-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.scoreSummaryTextGroup}>
                <Text style={styles.scoreSummaryTitle}>문제를 모두 풀었어요</Text>
                <Text style={styles.scoreSummaryDescription}>
                  총 {totalCount}문제를 끝까지 완료했습니다.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={Platform.OS !== "web" ? FadeInDown.delay(600).springify() : undefined}
          style={styles.resultDots}
        >
          {resultsArr.map((correct, i) => (
            <View
              key={i}
              style={[
                styles.resultDot,
                {
                  backgroundColor: correct ? Colors.light.tint : "#EF4444",
                },
              ]}
            >
              <Ionicons
                name={correct ? "checkmark" : "close"}
                size={16}
                color="#FFF"
              />
            </View>
          ))}
        </Animated.View>

        <View style={styles.buttonsSection}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/study/literature");
            }}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.light.tint} />
            <Text style={styles.secondaryButtonText}>목록으로</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="refresh" size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>다시 풀기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    overflow: "hidden",
  },
  confettiDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 0,
    zIndex: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  mascotWrapper: {
    marginBottom: 4,
  },
  messageSection: {
    alignItems: "center",
    gap: 4,
  },
  messageText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 28,
    color: Colors.light.text,
  },
  titleText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    color: Colors.light.textMuted,
  },
  scoreCard: {
    width: "100%",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    gap: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  scorePercentage: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 52,
    color: "#FFF",
  },
  scoreDetails: {
    width: "100%",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  scoreDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  scoreValue: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 20,
    color: "#FFF",
  },
  scoreLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  resultDots: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  resultDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsSection: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    width: "100%",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  secondaryButtonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    color: Colors.light.tint,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.light.tint,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    color: "#FFF",
  },
});
