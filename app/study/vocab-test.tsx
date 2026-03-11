import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { ProgressBar } from "@/components/ProgressBar";
import { CheetahMascot } from "@/components/CheetahMascot";
import { useStudy } from "@/contexts/StudyContext";
import { classicPoetryVocab } from "@/data/vocabData";
import { buildWrongOnlyVocabQuestions } from "@/lib/vocabWrongOnly";
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

function CompletionCheckmark() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withSpring(1.2, { damping: 6, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 300 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.completionCheckmark, animStyle]}>
      <Ionicons name="checkmark-circle" size={96} color={Colors.light.success} />
    </Animated.View>
  );
}

type TestQuestion = {
  id: string;
  sourceQuestionId?: string;
  word: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  example: string;
};

export default function VocabTestScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isWrongOnlyMode = mode === "wrong-only";

  const {
    updateVocabProgress,
    addIncorrectNote,
    markVocabCompleted,
    incorrectNotes,
    recordWrongReviewResult,
  } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongOnlyCorrectCount, setWrongOnlyCorrectCount] = useState(0);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const questions = useMemo<TestQuestion[]>(() => {
    if (isWrongOnlyMode) return buildWrongOnlyVocabQuestions(incorrectNotes);
    return classicPoetryVocab.map((item) => ({
      id: item.id,
      word: item.word,
      options: item.options,
      correctIndex: item.correctIndex,
      explanation: item.explanation,
      example: item.example,
    }));
  }, [isWrongOnlyMode, incorrectNotes]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = totalQuestions > 0
    ? (currentIndex + (isAnswered ? 1 : 0)) / totalQuestions
    : 0;
  const wrongOnlyRemaining = Math.max(totalQuestions - wrongOnlyCorrectCount, 0);
  const wrongOnlyAccuracy = totalQuestions > 0
    ? Math.round((wrongOnlyCorrectCount / totalQuestions) * 100)
    : 0;

  const handleSelectAnswer = useCallback((index: number) => {
    if (!currentQuestion || isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (isWrongOnlyMode) {
        setWrongOnlyCorrectCount((prev) => prev + 1);
        recordWrongReviewResult(currentQuestion.sourceQuestionId!, true);
      } else {
        updateVocabProgress(currentQuestion.id);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (isWrongOnlyMode) {
        recordWrongReviewResult(currentQuestion.sourceQuestionId!, false);
      } else {
        addIncorrectNote({
          questionId: `vocab-${currentQuestion.id}`,
          quizId: "vocab-classic-poetry",
          quizTitle: "고전시가 어휘",
          quizAuthor: currentQuestion.word,
          categoryId: "vocab",
          statement: `"${currentQuestion.word}"의 뜻은?`,
          isTrue: false,
          explanation: currentQuestion.explanation,
          userAnswer: currentQuestion.options[index],
          correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
          noteType: "vocab",
          timestamp: Date.now(),
        });
      }
    }
  }, [isAnswered, currentQuestion, isWrongOnlyMode, updateVocabProgress, recordWrongReviewResult, addIncorrectNote]);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      if (!isWrongOnlyMode) markVocabCompleted();
      setIsFinished(true);
    }
  }, [currentIndex, totalQuestions, isWrongOnlyMode, markVocabCompleted]);

  if (totalQuestions === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.finishContent, {
          paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 40,
          paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
        }]}>
          <Ionicons name="checkmark-done-circle" size={80} color={Colors.light.success} />
          <Text style={styles.finishTitle}>복습할 어휘 오답이 없어요</Text>
          <Text style={styles.finishSubtext}>오답노트에서 새로운 어휘 문제를 추가해보세요.</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.finishHomeBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.finishHomeBtnText}>돌아가기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={styles.container}>
        <View style={[styles.finishContent, {
          paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 40,
          paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
        }]}> 
          <CompletionCheckmark />
          <View style={styles.finishMascotRow}>
            <CheetahMascot size={70} />
          </View>
          <Text style={styles.finishTitle}>{isWrongOnlyMode ? "오답 어휘 복습 완료!" : "오늘의 어휘 학습 완료!"}</Text>
          <Text style={styles.finishSubtext}>{isWrongOnlyMode ? "졸업 기준(2회 정답)에 따라 오답이 정리됩니다." : "꾸준한 성장이 보입니다."}</Text>

          {isWrongOnlyMode ? (
            <View style={styles.reviewStatsCard}>
              <View style={styles.reviewStatItem}>
                <Ionicons name="ribbon" size={18} color={Colors.light.tint} />
                <Text style={styles.reviewStatLabel}>정답률</Text>
                <Text style={styles.reviewStatValue}>{wrongOnlyAccuracy}%</Text>
              </View>
              <View style={styles.reviewStatDivider} />
              <View style={styles.reviewStatItem}>
                <Ionicons name="list" size={18} color="#EF4444" />
                <Text style={styles.reviewStatLabel}>남은 오답</Text>
                <Text style={[styles.reviewStatValue, { color: "#EF4444" }]}>{wrongOnlyRemaining}개</Text>
              </View>
            </View>
          ) : (
            <View style={styles.finishCompletedCard}>
              <Ionicons name="sparkles" size={24} color={Colors.light.tint} />
              <Text style={styles.finishCompletedLabel}>고전시가 어휘 테스트</Text>
              <View style={styles.finishCompletedBadge}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
                <Text style={styles.finishCompletedBadgeText}>완료</Text>
              </View>
            </View>
          )}

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => [styles.finishHomeBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          >
            <Ionicons name="home" size={20} color="#FFF" />
            <Text style={styles.finishHomeBtnText}>홈으로 돌아가기</Text>
          </Pressable>
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
          <ProgressBar progress={progress} height={10} color={isWrongOnlyMode ? "#00B4D8" : Colors.light.tint} />
        </View>
        <Text style={[styles.questionCounter, isWrongOnlyMode && { color: "#00B4D8" }]}>
          {Math.min(currentIndex + 1, totalQuestions)}/{totalQuestions}
        </Text>
      </View>

      {isWrongOnlyMode && (
        <View style={styles.reviewModeBanner}>
          <Ionicons name="refresh-circle-outline" size={16} color="#007C92" />
          <Text style={styles.reviewModeText}>오답 복습 모드 · 정답률 {wrongOnlyAccuracy}% · 남은 오답 {wrongOnlyRemaining}개</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.wordCard, isWrongOnlyMode && { borderColor: "#00B4D8" }]}> 
          <Text style={styles.wordLabel}>{isWrongOnlyMode ? "오답 어휘 다시 확인" : "다음 어휘의 뜻은?"}</Text>
          <Text style={[styles.wordText, isWrongOnlyMode && { color: "#00B4D8" }]}>{currentQuestion.word}</Text>
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
              isWrongOnlyMode && { backgroundColor: "#00B4D8", shadowColor: "#00B4D8" },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex < totalQuestions - 1 ? "다음" : "완료"}
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
  reviewModeBanner: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#D9F7FC",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reviewModeText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: "#007C92",
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
    gap: 12,
  },
  completionCheckmark: {
    marginBottom: 4,
  },
  finishMascotRow: {
    marginBottom: 8,
  },
  finishTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 24,
    color: Colors.light.text,
    textAlign: "center",
  },
  finishSubtext: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    color: Colors.light.textMuted,
    marginBottom: 20,
    textAlign: "center",
  },
  finishCompletedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: Colors.light.success,
  },
  finishCompletedLabel: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 15,
    color: Colors.light.text,
    flex: 1,
  },
  finishCompletedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.success,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  finishCompletedBadgeText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  reviewStatsCard: {
    width: "100%",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#00B4D8",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  reviewStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  reviewStatDivider: {
    width: 1,
    height: 52,
    backgroundColor: Colors.light.border,
  },
  reviewStatLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  reviewStatValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 22,
    color: Colors.light.tint,
  },
  finishHomeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.tint,
    height: 54,
    borderRadius: 16,
    width: "100%",
    marginTop: 12,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  finishHomeBtnText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: "#FFF",
  },
});
