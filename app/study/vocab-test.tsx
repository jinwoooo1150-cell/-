import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "@/components/ProgressBar";
import { CheetahMascot } from "@/components/CheetahMascot";
import { useStudy } from "@/contexts/StudyContext";
import { classicPoetryVocab, VocabQuestion } from "@/data/vocabData";
import Colors from "@/constants/colors";

function ChoiceButton({
  label,
  index,
  onPress,
  disabled,
  state,
}: {
  label: string;
  index: number;
  onPress: () => void;
  disabled: boolean;
  state: "default" | "correct" | "incorrect" | "dimmed";
}) {
  const scale = useSharedValue(1);

  const bgColor = state === "correct"
    ? Colors.light.success
    : state === "incorrect"
      ? "#EF4444"
      : state === "dimmed"
        ? "#E8E0DA"
        : Colors.light.card;

  const textColor = state === "correct" || state === "incorrect"
    ? "#FFF"
    : state === "dimmed"
      ? Colors.light.textMuted
      : Colors.light.text;

  const borderColor = state === "correct"
    ? Colors.light.success
    : state === "incorrect"
      ? "#EF4444"
      : Colors.light.border;

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const labels = ["\u2460", "\u2461", "\u2462", "\u2463"];

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[styles.choiceButton, { backgroundColor: bgColor, borderColor }, buttonStyle]}>
        <Text style={[styles.choiceIndex, { color: textColor }]}>{labels[index]}</Text>
        <Text style={[styles.choiceLabel, { color: textColor }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function VocabTestScreen() {
  const insets = useSafeAreaInsets();
  const { vocabProgress, updateVocabProgress } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const questions = classicPoetryVocab;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + (isAnswered ? 1 : 0)) / totalQuestions;

  const handleSelectAnswer = useCallback((index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateVocabProgress(currentQuestion.id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setResults((prev) => [...prev, isCorrect]);
  }, [isAnswered, currentQuestion]);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, totalQuestions]);

  const correctCount = results.filter(Boolean).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  if (isFinished) {
    return (
      <View style={styles.container}>
        <View style={[styles.finishContent, {
          paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 40,
          paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
        }]}>
          <CheetahMascot size={80} />
          <Text style={styles.finishMessage}>
            {percentage >= 80 ? "훌륭해요!" : percentage >= 60 ? "잘했어요!" : "다시 도전해요!"}
          </Text>
          <Text style={styles.finishSubtext}>고전시가 어휘 테스트</Text>

          <LinearGradient
            colors={[Colors.light.tint, Colors.light.tintDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.finishScoreCard}
          >
            <Text style={styles.finishPercentage}>{percentage}%</Text>
            <View style={styles.finishScoreRow}>
              <View style={styles.finishScoreItem}>
                <Text style={styles.finishScoreValue}>{correctCount}</Text>
                <Text style={styles.finishScoreLabel}>정답</Text>
              </View>
              <View style={styles.finishDivider} />
              <View style={styles.finishScoreItem}>
                <Text style={styles.finishScoreValue}>{totalQuestions - correctCount}</Text>
                <Text style={styles.finishScoreLabel}>오답</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.finishButtons}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={({ pressed }) => [styles.finishSecondaryBtn, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.light.tint} />
              <Text style={styles.finishSecondaryText}>홈으로</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setCurrentIndex(0);
                setSelectedIndex(null);
                setIsAnswered(false);
                setResults([]);
                setIsFinished(false);
              }}
              style={({ pressed }) => [styles.finishPrimaryBtn, pressed && { opacity: 0.9 }]}
            >
              <Ionicons name="refresh" size={20} color="#FFF" />
              <Text style={styles.finishPrimaryText}>다시 풀기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const getChoiceState = (index: number): "default" | "correct" | "incorrect" | "dimmed" => {
    if (!isAnswered) return "default";
    if (index === currentQuestion.correctIndex) return "correct";
    if (index === selectedIndex) return "incorrect";
    return "dimmed";
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {
        paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 8,
      }]}>
        <Pressable onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.light.text} />
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} height={10} color={Colors.light.tint} />
        </View>
        <Text style={styles.questionCounter}>
          {Math.min(currentIndex + 1, totalQuestions)}/{totalQuestions}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wordCard}>
          <Text style={styles.wordLabel}>다음 어휘의 뜻은?</Text>
          <Text style={styles.wordText}>{currentQuestion.word}</Text>
          <View style={styles.exampleBox}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.light.textMuted} />
            <Text style={styles.exampleText}>{currentQuestion.example}</Text>
          </View>
        </View>

        <View style={styles.choicesContainer}>
          {currentQuestion.options.map((option, index) => (
            <ChoiceButton
              key={index}
              label={option}
              index={index}
              onPress={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              state={getChoiceState(index)}
            />
          ))}
        </View>

        {isAnswered && (
          <Animated.View
            entering={Platform.OS !== "web" ? FadeInDown.duration(400).springify() : undefined}
            style={styles.feedbackSection}
          >
            <View style={[styles.feedbackBadge, {
              backgroundColor: selectedIndex === currentQuestion.correctIndex ? Colors.light.success : "#EF4444",
            }]}>
              <Ionicons
                name={selectedIndex === currentQuestion.correctIndex ? "checkmark" : "close"}
                size={24}
                color="#FFF"
              />
            </View>
            <Text style={[styles.feedbackLabel, {
              color: selectedIndex === currentQuestion.correctIndex ? Colors.light.success : "#EF4444",
            }]}>
              {selectedIndex === currentQuestion.correctIndex ? "정답!" : "오답"}
            </Text>
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <Ionicons name="bulb" size={16} color={Colors.light.tint} />
                <Text style={styles.explanationTitle}>해설</Text>
              </View>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {isAnswered && (
        <Animated.View
          entering={Platform.OS !== "web" ? FadeIn.duration(300) : undefined}
          style={[styles.bottomBar, {
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 16,
          }]}
        >
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex < totalQuestions - 1 ? "다음" : "결과 보기"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    flex: 1,
  },
  questionCounter: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.tint,
    minWidth: 36,
    textAlign: "right",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  wordCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  wordLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  wordText: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 32,
    color: Colors.light.tint,
  },
  exampleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.cream,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exampleText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  choicesContainer: {
    gap: 10,
    marginBottom: 20,
  },
  choiceButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  choiceIndex: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
  },
  choiceLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 15,
    flex: 1,
  },
  feedbackSection: {
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  feedbackBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackLabel: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
  },
  explanationCard: {
    width: "100%",
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  explanationTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 13,
    color: Colors.light.tint,
  },
  explanationText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    lineHeight: 22,
    color: Colors.light.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 14,
    paddingHorizontal: 20,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.tint,
    height: 54,
    borderRadius: 16,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: "#FFF",
  },
  finishContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  finishMessage: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 28,
    color: Colors.light.text,
  },
  finishSubtext: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 15,
    color: Colors.light.textMuted,
  },
  finishScoreCard: {
    width: "100%",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    gap: 16,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  finishPercentage: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 48,
    color: "#FFF",
  },
  finishScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  finishScoreItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  finishDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  finishScoreValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 22,
    color: "#FFF",
  },
  finishScoreLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  finishButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  finishSecondaryBtn: {
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
  finishSecondaryText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.tint,
  },
  finishPrimaryBtn: {
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
  finishPrimaryText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: "#FFF",
  },
});
