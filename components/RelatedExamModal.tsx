import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInDown,
} from "react-native-reanimated";
import { RelatedExamQuestion } from "@/data/quizData";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface RelatedExamModalProps {
  visible: boolean;
  onClose: () => void;
  questions: RelatedExamQuestion[];
  quizId: string;
  quizTitle: string;
  quizAuthor: string;
  categoryId: string;
}

type ExamAnswerState = "unanswered" | "correct" | "incorrect";

function ExamOXButton({
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
  answerState: ExamAnswerState;
}) {
  const scale = useSharedValue(1);

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

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={styles.oxButtonWrapper}
    >
      <Animated.View style={[styles.oxButton, { backgroundColor: bgColor }, buttonStyle, disabled && !selected && answerState !== "unanswered" && styles.oxButtonDimmed]}>
        <Text style={styles.oxButtonLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function BounceResultIcon({ correct }: { correct: boolean }) {
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
        size={24}
        color="#FFF"
      />
    </Animated.View>
  );
}

function ExamQuestionCard({
  question,
  index,
  quizId,
  quizTitle,
  quizAuthor,
  categoryId,
}: {
  question: RelatedExamQuestion;
  index: number;
  quizId: string;
  quizTitle: string;
  quizAuthor: string;
  categoryId: string;
}) {
  const [answerState, setAnswerState] = useState<ExamAnswerState>("unanswered");
  const [selectedAnswer, setSelectedAnswer] = useState<"O" | "X" | null>(null);
  const { addIncorrectNote, addBookmark, removeBookmark, isBookmarked } = useStudy();

  const bookmarked = isBookmarked(question.id);

  const handleToggleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (bookmarked) {
      removeBookmark(question.id);
    } else {
      addBookmark({
        questionId: question.id,
        quizId,
        quizTitle: question.sourceTitle,
        quizAuthor: quizTitle,
        categoryId,
        statement: question.statement,
        isTrue: question.isTrue,
        explanation: question.explanation,
        sourceTitle: question.sourceTitle,
        noteType: "exam",
        timestamp: Date.now(),
      });
    }
  };

  const handleAnswer = (answer: "O" | "X") => {
    if (answerState !== "unanswered") return;
    setSelectedAnswer(answer);
    const isCorrect =
      (answer === "O" && question.isTrue) ||
      (answer === "X" && !question.isTrue);

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAnswerState("correct");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAnswerState("incorrect");
      addIncorrectNote({
        questionId: question.id,
        quizId,
        quizTitle: question.sourceTitle,
        quizAuthor: quizTitle,
        categoryId,
        statement: question.statement,
        isTrue: question.isTrue,
        explanation: question.explanation,
        userAnswer: answer,
        sourceTitle: question.sourceTitle,
        noteType: "exam",
        timestamp: Date.now(),
      });
    }
  };

  return (
    <Animated.View
      entering={Platform.OS !== "web" ? FadeInDown.delay(index * 120).springify() : undefined}
      style={styles.examCard}
    >
      <View style={styles.examCardHeader}>
        <View style={styles.sourceBadge}>
          <Ionicons name="school-outline" size={12} color="#FFF" />
          <Text style={styles.sourceBadgeText}>{question.sourceTitle}</Text>
        </View>
        <Pressable onPress={handleToggleBookmark} hitSlop={8} style={styles.bookmarkBtn}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={bookmarked ? Colors.light.tint : Colors.light.textMuted}
          />
        </Pressable>
      </View>

      <Text style={styles.examStatement}>{question.statement}</Text>

      <View style={styles.examOXRow}>
        <ExamOXButton
          label="O"
          type="O"
          onPress={() => handleAnswer("O")}
          disabled={answerState !== "unanswered"}
          selected={selectedAnswer === "O"}
          answerState={answerState}
        />
        <ExamOXButton
          label="X"
          type="X"
          onPress={() => handleAnswer("X")}
          disabled={answerState !== "unanswered"}
          selected={selectedAnswer === "X"}
          answerState={answerState}
        />
      </View>

      {answerState !== "unanswered" && (
        <Animated.View
          entering={Platform.OS !== "web" ? FadeInDown.duration(300).springify() : undefined}
          style={styles.examFeedback}
        >
          <View style={styles.feedbackRow}>
            <BounceResultIcon correct={answerState === "correct"} />
            <Text
              style={[
                styles.feedbackLabel,
                { color: answerState === "correct" ? Colors.light.success : "#EF4444" },
              ]}
            >
              {answerState === "correct" ? "정답!" : "오답"}
            </Text>
          </View>
          <View style={styles.examExplanationBox}>
            <Ionicons name="bulb" size={14} color={Colors.light.tint} />
            <Text style={styles.examExplanationText}>{question.explanation}</Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function RelatedExamModal({
  visible,
  onClose,
  questions,
  quizId,
  quizTitle,
  quizAuthor,
  categoryId,
}: RelatedExamModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color={Colors.light.text} />
          </Pressable>
          <View style={styles.modalTitleRow}>
            <Ionicons name="school" size={20} color="#8B5CF6" />
            <Text style={styles.modalTitle}>연관 기출</Text>
          </View>
          <View style={styles.modalCountBadge}>
            <Text style={styles.modalCountText}>{questions.length}문항</Text>
          </View>
        </View>

        <View style={styles.modalSubHeader}>
          <Text style={styles.modalSubTitle}>{quizTitle}</Text>
          <Text style={styles.modalSubAuthor}>{quizAuthor}</Text>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {questions.map((q, i) => (
            <ExamQuestionCard
              key={q.id}
              question={q}
              index={i}
              quizId={quizId}
              quizTitle={quizTitle}
              quizAuthor={quizAuthor}
              categoryId={categoryId}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "web" ? 67 + 12 : 16,
    paddingBottom: 14,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  modalCountBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modalCountText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  modalSubHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalSubTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 15,
    color: Colors.light.text,
  },
  modalSubAuthor: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  examCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  examCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sourceBadgeText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 11,
    color: "#FFF",
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  examStatement: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.text,
  },
  examOXRow: {
    flexDirection: "row",
    gap: 12,
  },
  oxButtonWrapper: {
    flex: 1,
  },
  oxButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  oxButtonDimmed: {
    opacity: 0.4,
  },
  oxButtonLabel: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: "#FFF",
  },
  examFeedback: {
    gap: 10,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feedbackIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackLabel: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 18,
  },
  examExplanationBox: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: Colors.light.cream,
    padding: 12,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  examExplanationText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    flex: 1,
  },
});
