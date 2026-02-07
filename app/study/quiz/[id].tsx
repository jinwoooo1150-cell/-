import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { ProgressBar } from "@/components/ProgressBar";
import { getQuizById } from "@/data/quizData";
import Colors from "@/constants/colors";

type AnswerState = "unanswered" | "correct" | "incorrect";

function OXButton({
  label,
  type,
  onPress,
  disabled,
  selected,
  answerState,
}: {
  label: string;
  type: "O" | "X";
  onPress: () => void;
  disabled: boolean;
  selected: boolean;
  answerState: AnswerState;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const isCorrectAnswer =
    (answerState === "correct" && selected) ||
    (answerState === "incorrect" && !selected);

  const bgColor =
    answerState === "unanswered"
      ? type === "O"
        ? "#3B82F6"
        : Colors.light.tint
      : selected
        ? answerState === "correct"
          ? Colors.light.success
          : "#EF4444"
        : isCorrectAnswer
          ? Colors.light.success
          : "#D1D5DB";

  const shadowColor =
    answerState === "unanswered"
      ? type === "O"
        ? "#2563EB"
        : Colors.light.tintDark
      : selected
        ? answerState === "correct"
          ? Colors.light.successDark
          : "#DC2626"
        : isCorrectAnswer
          ? Colors.light.successDark
          : "#9CA3AF";

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    translateY.value = withTiming(5, { duration: 60 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={styles.oxButtonWrapper}
    >
      <Animated.View style={buttonStyle}>
        <View style={[styles.oxButtonShadow, { backgroundColor: shadowColor }]}>
          <View
            style={[
              styles.oxButton,
              { backgroundColor: bgColor },
              disabled && !selected && answerState !== "unanswered" && styles.oxButtonDimmed,
            ]}
          >
            <Text style={styles.oxButtonLabel}>{label}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function BounceIcon({ correct }: { correct: boolean }) {
  const bounceScale = useSharedValue(0);

  React.useEffect(() => {
    bounceScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.feedbackIcon,
        { backgroundColor: correct ? Colors.light.success : "#EF4444" },
        iconStyle,
      ]}
    >
      <Ionicons
        name={correct ? "checkmark" : "close"}
        size={32}
        color="#FFF"
      />
    </Animated.View>
  );
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const quiz = getQuizById(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedAnswer, setSelectedAnswer] = useState<"O" | "X" | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const progress = (currentIndex + (answerState !== "unanswered" ? 1 : 0)) / totalQuestions;

  const handleAnswer = useCallback(
    (answer: "O" | "X") => {
      if (answerState !== "unanswered") return;
      setSelectedAnswer(answer);
      const isCorrect =
        (answer === "O" && currentQuestion.isTrue) ||
        (answer === "X" && !currentQuestion.isTrue);

      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAnswerState("correct");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setAnswerState("incorrect");
      }
      setResults((prev) => [...prev, isCorrect]);
    },
    [answerState, currentQuestion]
  );

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("unanswered");
      setSelectedAnswer(null);
    } else {
      router.replace({
        pathname: "/study/quiz/result",
        params: {
          quizId: quiz.id,
          results: JSON.stringify(results),
          title: quiz.title,
          total: totalQuestions.toString(),
        },
      });
    }
  }, [currentIndex, totalQuestions, results, quiz]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 8 },
        ]}
      >
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.light.text} />
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar
            progress={progress}
            height={10}
            color={Colors.light.tint}
          />
        </View>
        <Text style={styles.questionCounter}>
          {Math.min(currentIndex + 1, totalQuestions)}/{totalQuestions}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 220 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.passageCard}>
          <View style={styles.passageMeta}>
            <Text style={styles.passageTitle}>{quiz.title}</Text>
            <View style={styles.passageMetaRow}>
              <Text style={styles.passageAuthor}>{quiz.author}</Text>
              <Text style={styles.passageSource}>{quiz.source}</Text>
            </View>
          </View>
          <View style={styles.passageDivider} />
          <Text style={styles.passageText}>{quiz.passage}</Text>
        </View>

        <Animated.View
          key={currentIndex}
          entering={Platform.OS !== "web" ? SlideInRight.duration(300).springify() : undefined}
          style={styles.questionSection}
        >
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>
              Q{currentIndex + 1}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.statement}</Text>
        </Animated.View>

        {answerState !== "unanswered" && (
          <Animated.View
            entering={Platform.OS !== "web" ? FadeInDown.duration(400).springify() : undefined}
            style={styles.feedbackSection}
          >
            <BounceIcon correct={answerState === "correct"} />
            <Text
              style={[
                styles.feedbackLabel,
                {
                  color:
                    answerState === "correct"
                      ? Colors.light.success
                      : "#EF4444",
                },
              ]}
            >
              {answerState === "correct" ? "정답!" : "오답"}
            </Text>
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <Ionicons
                  name="bulb"
                  size={18}
                  color={Colors.light.tint}
                />
                <Text style={styles.explanationTitle}>해설</Text>
              </View>
              <Text style={styles.explanationText}>
                {currentQuestion.explanation}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 16 },
        ]}
      >
        {answerState === "unanswered" ? (
          <Animated.View
            entering={Platform.OS !== "web" ? FadeIn.duration(300) : undefined}
            style={styles.oxRow}
          >
            <OXButton
              label="O"
              type="O"
              onPress={() => handleAnswer("O")}
              disabled={false}
              selected={selectedAnswer === "O"}
              answerState={answerState}
            />
            <OXButton
              label="X"
              type="X"
              onPress={() => handleAnswer("X")}
              disabled={false}
              selected={selectedAnswer === "X"}
              answerState={answerState}
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={Platform.OS !== "web" ? FadeInUp.duration(300).springify() : undefined}
            style={styles.answeredBottom}
          >
            <View style={styles.oxRowSmall}>
              <OXButton
                label="O"
                type="O"
                onPress={() => {}}
                disabled={true}
                selected={selectedAnswer === "O"}
                answerState={answerState}
              />
              <OXButton
                label="X"
                type="X"
                onPress={() => {}}
                disabled={true}
                selected={selectedAnswer === "X"}
                answerState={answerState}
              />
            </View>
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
    paddingTop: 20,
  },
  passageCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  passageMeta: {
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  passageTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.text,
  },
  passageMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  passageAuthor: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  passageSource: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  passageDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  passageText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 15,
    lineHeight: 28,
    color: Colors.light.text,
    letterSpacing: 0.3,
  },
  questionSection: {
    backgroundColor: Colors.light.cream,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  questionBadge: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  questionBadgeText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  questionText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 16,
    lineHeight: 26,
    color: Colors.light.text,
  },
  feedbackSection: {
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  feedbackIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackLabel: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 22,
  },
  explanationCard: {
    width: "100%",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 18,
    gap: 10,
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
    fontSize: 14,
    color: Colors.light.tint,
  },
  explanationText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 14,
    lineHeight: 24,
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
  oxRow: {
    flexDirection: "row",
    gap: 16,
  },
  oxRowSmall: {
    flexDirection: "row",
    gap: 12,
  },
  answeredBottom: {
    gap: 12,
  },
  oxButtonWrapper: {
    flex: 1,
  },
  oxButtonShadow: {
    borderRadius: 18,
    paddingBottom: 5,
  },
  oxButton: {
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  oxButtonDimmed: {
    opacity: 0.4,
  },
  oxButtonLabel: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 28,
    color: "#FFF",
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
});
