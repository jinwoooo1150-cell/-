import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Dimensions,
  Switch,
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
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "@/components/ProgressBar";
import { CheetahMascot, CheetahMood } from "@/components/CheetahMascot";
import { getQuizById, NarrativePhase, CharacterMapData, CharacterRelation } from "@/data/quizData";
import { RelatedExamModal } from "@/components/RelatedExamModal";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

type AnswerState = "unanswered" | "correct" | "incorrect";

const phaseLabels: Record<NarrativePhase, string> = {
  exposition: "발단",
  rising: "전개",
  climax: "절정",
  falling: "하강",
  resolution: "결말",
};

const phaseOrder: NarrativePhase[] = ["exposition", "rising", "climax", "falling", "resolution"];

const { width: screenWidth } = Dimensions.get("window");

function NarrativeProgressBar({ currentPhase, sections }: { currentPhase: NarrativePhase; sections: { phase: NarrativePhase; title: string; summary: string }[] }) {
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <View style={npStyles.container}>
      <View style={npStyles.track}>
        {phaseOrder.map((phase, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const section = sections.find((s) => s.phase === phase);
          return (
            <View key={phase} style={npStyles.phaseItem}>
              <View style={[
                npStyles.dot,
                isActive && npStyles.dotActive,
                isCurrent && npStyles.dotCurrent,
              ]}>
                {isCurrent && <View style={npStyles.dotInner} />}
              </View>
              <Text style={[
                npStyles.phaseLabel,
                isActive && npStyles.phaseLabelActive,
                isCurrent && npStyles.phaseLabelCurrent,
              ]}>{phaseLabels[phase]}</Text>
              {idx < phaseOrder.length - 1 && (
                <View style={[npStyles.connector, isActive && npStyles.connectorActive]} />
              )}
            </View>
          );
        })}
      </View>
      {sections.find((s) => s.phase === currentPhase) && (
        <View style={npStyles.summaryBox}>
          <Text style={npStyles.summaryTitle}>
            {sections.find((s) => s.phase === currentPhase)?.title}
          </Text>
          <Text style={npStyles.summaryText}>
            {sections.find((s) => s.phase === currentPhase)?.summary}
          </Text>
        </View>
      )}
    </View>
  );
}

const npStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  track: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 4 },
  phaseItem: { alignItems: "center", flex: 1, position: "relative" },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.light.border, marginBottom: 4, alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: Colors.light.tintLight },
  dotCurrent: { backgroundColor: Colors.light.tint, width: 18, height: 18, borderRadius: 9 },
  dotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFF" },
  connector: { position: "absolute", top: 7, left: "60%" as any, right: "-40%" as any, height: 2, backgroundColor: Colors.light.border },
  connectorActive: { backgroundColor: Colors.light.tintLight },
  phaseLabel: { fontFamily: "NotoSansKR_400Regular", fontSize: 10, color: Colors.light.textMuted, textAlign: "center" },
  phaseLabelActive: { color: Colors.light.tintDark },
  phaseLabelCurrent: { fontFamily: "NotoSansKR_700Bold", color: Colors.light.tint },
  summaryBox: { marginTop: 8, backgroundColor: Colors.light.cream, borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: Colors.light.tint },
  summaryTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 12, color: Colors.light.text, marginBottom: 2 },
  summaryText: { fontFamily: "NotoSansKR_400Regular", fontSize: 11, color: Colors.light.textSecondary, lineHeight: 16 },
});

function CharacterMapModal({ visible, onClose, data }: { visible: boolean; onClose: () => void; data: CharacterMapData }) {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const getRelationColor = (type: CharacterRelation["type"]) => {
    switch (type) {
      case "supporter": return Colors.light.tint;
      case "antagonist": return "#EF4444";
      case "family": return "#3B82F6";
      case "neutral": return Colors.light.textMuted;
    }
  };

  const getRelationStyle = (type: CharacterRelation["type"]) => {
    return type === "antagonist" ? "dashed" as const : "solid" as const;
  };

  const getRoleBg = (role: string) => {
    if (role === "주인공") return Colors.light.tint;
    if (role === "적대자") return "#EF4444";
    if (role === "조력자") return "#3B82F6";
    if (role.includes("아버지") || role.includes("어머니")) return "#8B5CF6";
    return Colors.light.textMuted;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[cmStyles.container, { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 8 }]}>
        <View style={cmStyles.header}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={Colors.light.text} />
          </Pressable>
          <Text style={cmStyles.headerTitle}>인물 관계도</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={cmStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={cmStyles.legendRow}>
            <View style={cmStyles.legendItem}>
              <View style={[cmStyles.legendLine, { backgroundColor: Colors.light.tint }]} />
              <Text style={cmStyles.legendText}>조력/충성</Text>
            </View>
            <View style={cmStyles.legendItem}>
              <View style={[cmStyles.legendLine, { backgroundColor: "#EF4444", borderStyle: "dashed" as any }]} />
              <Text style={cmStyles.legendText}>적대/모함</Text>
            </View>
            <View style={cmStyles.legendItem}>
              <View style={[cmStyles.legendLine, { backgroundColor: "#3B82F6" }]} />
              <Text style={cmStyles.legendText}>가족</Text>
            </View>
          </View>

          <View style={cmStyles.characterGrid}>
            {data.characters.map((char) => (
              <View key={char.name} style={cmStyles.characterCard}>
                <View style={[cmStyles.charBadge, { backgroundColor: getRoleBg(char.role) }]}>
                  <Text style={cmStyles.charBadgeText}>{char.role}</Text>
                </View>
                <Text style={cmStyles.charName}>{char.name}</Text>
                <Text style={cmStyles.charDesc}>{char.description}</Text>
              </View>
            ))}
          </View>

          <Text style={cmStyles.relationsTitle}>관계</Text>
          <View style={cmStyles.relationsContainer}>
            {data.relations.map((rel, idx) => (
              <View key={idx} style={cmStyles.relationRow}>
                <Text style={cmStyles.relationFrom}>{rel.from}</Text>
                <View style={cmStyles.relationArrow}>
                  <View style={[cmStyles.relationLine, {
                    backgroundColor: getRelationColor(rel.type),
                    borderStyle: getRelationStyle(rel.type),
                  }]} />
                  <Text style={[cmStyles.relationLabel, { color: getRelationColor(rel.type) }]}>{rel.label}</Text>
                </View>
                <Text style={cmStyles.relationTo}>{rel.to}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const cmStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  headerTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 18, color: Colors.light.text },
  scrollContent: { padding: 20, paddingBottom: 40 },
  legendRow: { flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 20 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendLine: { width: 20, height: 3, borderRadius: 1.5 },
  legendText: { fontFamily: "NotoSansKR_400Regular", fontSize: 11, color: Colors.light.textMuted },
  characterGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  characterCard: { width: "47%" as any, backgroundColor: Colors.light.card, borderRadius: 14, padding: 14, gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  charBadge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  charBadgeText: { fontFamily: "NotoSansKR_500Medium", fontSize: 10, color: "#FFF" },
  charName: { fontFamily: "NotoSansKR_900Black", fontSize: 18, color: Colors.light.text },
  charDesc: { fontFamily: "NotoSansKR_400Regular", fontSize: 11, color: Colors.light.textSecondary, lineHeight: 16 },
  relationsTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 16, color: Colors.light.text, marginBottom: 12 },
  relationsContainer: { gap: 10 },
  relationRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.light.card, borderRadius: 12, padding: 12 },
  relationFrom: { fontFamily: "NotoSansKR_700Bold", fontSize: 14, color: Colors.light.text, width: 70 },
  relationArrow: { flex: 1, alignItems: "center", gap: 2 },
  relationLine: { width: "80%" as any, height: 2, borderRadius: 1 },
  relationLabel: { fontFamily: "NotoSansKR_500Medium", fontSize: 10 },
  relationTo: { fontFamily: "NotoSansKR_700Bold", fontSize: 14, color: Colors.light.text, width: 70, textAlign: "right" },
});

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
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);

  const isCorrectAnswer =
    (answerState === "correct" && selected) ||
    (answerState === "incorrect" && !selected);

  const bgColor =
    answerState === "unanswered"
      ? type === "O"
        ? Colors.light.tint
        : "#E07800"
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
        ? Colors.light.tintDark
        : "#C06800"
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
    rippleOpacity.value = withTiming(0.3, { duration: 100 });
    rippleScale.value = withTiming(1.5, { duration: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    rippleOpacity.value = withTiming(0, { duration: 300 });
    rippleScale.value = withTiming(0, { duration: 300 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
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
              { backgroundColor: bgColor, overflow: "hidden" },
              disabled && !selected && answerState !== "unanswered" && styles.oxButtonDimmed,
            ]}
          >
            <Animated.View style={[{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.4)",
            }, rippleStyle]} />
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
  const { addIncorrectNote, addBookmark, removeBookmark, isBookmarked, addCompletedWork, addLearningTime } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedAnswer, setSelectedAnswer] = useState<"O" | "X" | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showCharacterMap, setShowCharacterMap] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(true);
  const startTimeRef = useRef(Date.now());

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  useEffect(() => {
    return () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) {
        addLearningTime(elapsed);
      }
    };
  }, []);

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
  const currentBookmarked = isBookmarked(currentQuestion.id);
  const hasRelatedExams = (quiz.relatedExams?.length ?? 0) > 0;
  const hasNarrative = !!quiz.narrativePhase && !!quiz.narrativeSections;
  const hasCharacterMap = !!quiz.characterMap;
  const hasTranslation = !!quiz.originalText && !!quiz.modernText;
  const isPoetry = quiz.categoryId === "classic-poetry";

  const cheetahMood: CheetahMood =
    answerState === "correct" ? "happy" :
    answerState === "incorrect" ? "sad" : "neutral";

  const cheetahSpeech =
    answerState === "correct" ? "잘했어! 정답이야!" :
    answerState === "incorrect" ? "아쉽다... 다시 보자!" : undefined;

  const passageText = hasTranslation
    ? (showOriginalText ? quiz.originalText! : quiz.modernText!)
    : quiz.passage;

  const handleToggleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentBookmarked) {
      removeBookmark(currentQuestion.id);
    } else {
      addBookmark({
        questionId: currentQuestion.id,
        quizId: quiz.id,
        quizTitle: quiz.title,
        quizAuthor: quiz.author,
        categoryId: quiz.categoryId,
        statement: currentQuestion.statement,
        isTrue: currentQuestion.isTrue,
        explanation: currentQuestion.explanation,
        timestamp: Date.now(),
      });
    }
  };

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
        addIncorrectNote({
          questionId: currentQuestion.id,
          quizId: quiz.id,
          quizTitle: quiz.title,
          quizAuthor: quiz.author,
          categoryId: quiz.categoryId,
          statement: currentQuestion.statement,
          isTrue: currentQuestion.isTrue,
          explanation: currentQuestion.explanation,
          userAnswer: answer,
          timestamp: Date.now(),
        });
      }
      setResults((prev) => [...prev, isCorrect]);
    },
    [answerState, currentQuestion, quiz, addIncorrectNote]
  );

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("unanswered");
      setSelectedAnswer(null);
    } else {
      addCompletedWork(quiz.id);
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
  }, [currentIndex, totalQuestions, results, quiz, addCompletedWork]);

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
        {hasNarrative && (
          <NarrativeProgressBar
            currentPhase={quiz.narrativePhase!}
            sections={quiz.narrativeSections!}
          />
        )}

        <View style={styles.passageCard}>
          <View style={styles.passageMeta}>
            <Text style={styles.passageTitle}>{quiz.title}</Text>
            <View style={styles.passageMetaRow}>
              <Text style={styles.passageSource}>{quiz.source}</Text>
              <Text style={styles.passageAuthor}>{quiz.author}</Text>
            </View>
          </View>

          {(hasCharacterMap || hasTranslation) && (
            <View style={styles.featureRow}>
              {hasCharacterMap && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCharacterMap(true);
                  }}
                  style={({ pressed }) => [
                    styles.featureButton,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Ionicons name="people" size={16} color={Colors.light.tint} />
                  <Text style={styles.featureButtonText}>인물 관계도</Text>
                </Pressable>
              )}
              {hasTranslation && (
                <View style={styles.translationToggle}>
                  <Text style={[styles.toggleLabel, showOriginalText && styles.toggleLabelActive]}>원문</Text>
                  <Switch
                    value={!showOriginalText}
                    onValueChange={(val) => setShowOriginalText(!val)}
                    trackColor={{ false: Colors.light.tintLight, true: "#3B82F6" }}
                    thumbColor="#FFF"
                    style={{ transform: [{ scale: 0.8 }] }}
                  />
                  <Text style={[styles.toggleLabel, !showOriginalText && styles.toggleLabelActive]}>현대어</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.passageDivider} />
          <Text style={[
            styles.passageText,
            isPoetry && styles.poetryText,
          ]}>{passageText}</Text>

          {hasRelatedExams && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowExamModal(true);
              }}
              style={({ pressed }) => [
                styles.relatedExamButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name="school" size={16} color="#8B5CF6" />
              <Text style={styles.relatedExamButtonText}>연관 기출 {quiz.relatedExams!.length}문항</Text>
              <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
            </Pressable>
          )}
        </View>

        <Animated.View
          key={currentIndex}
          entering={Platform.OS !== "web" ? SlideInRight.duration(300).springify() : undefined}
          style={styles.questionSection}
        >
          <View style={styles.questionTopRow}>
            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>
                Q{currentIndex + 1}
              </Text>
            </View>
            <Pressable onPress={handleToggleBookmark} hitSlop={8} style={styles.bookmarkButton}>
              <Ionicons
                name={currentBookmarked ? "bookmark" : "bookmark-outline"}
                size={22}
                color={currentBookmarked ? Colors.light.tint : Colors.light.textMuted}
              />
            </Pressable>
          </View>
          <Text style={styles.questionText}>{currentQuestion.statement}</Text>
        </Animated.View>

        {answerState !== "unanswered" && (
          <Animated.View
            entering={Platform.OS !== "web" ? FadeInDown.duration(400).springify() : undefined}
            style={styles.feedbackSection}
          >
            <View style={styles.cheetahFeedback}>
              <CheetahMascot size={60} mood={cheetahMood} speechBubble={cheetahSpeech} />
            </View>
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
                styles.nextButtonContainer,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <LinearGradient
                colors={[Colors.light.tint, Colors.light.tintDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex < totalQuestions - 1 ? "다음" : "결과 보기"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {hasRelatedExams && (
        <RelatedExamModal
          visible={showExamModal}
          onClose={() => setShowExamModal(false)}
          questions={quiz.relatedExams!}
          quizId={quiz.id}
          quizTitle={quiz.title}
          quizAuthor={quiz.author}
          categoryId={quiz.categoryId}
        />
      )}

      {hasCharacterMap && (
        <CharacterMapModal
          visible={showCharacterMap}
          onClose={() => setShowCharacterMap(false)}
          data={quiz.characterMap!}
        />
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
    paddingTop: 16,
  },
  passageCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
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
    marginBottom: 12,
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
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  featureButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.cream,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.tintGlow,
  },
  featureButtonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.tint,
  },
  translationToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  toggleLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  toggleLabelActive: {
    fontFamily: "NotoSansKR_700Bold",
    color: Colors.light.tint,
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
  poetryText: {
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  questionSection: {
    backgroundColor: Colors.light.cream,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  questionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  questionBadge: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  questionBadgeText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
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
  cheetahFeedback: {
    marginBottom: 4,
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
    zIndex: 2,
  },
  nextButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 16,
  },
  nextButtonText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: "#FFF",
  },
  relatedExamButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#F3EEFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DDD6FE",
  },
  relatedExamButtonText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 13,
    color: "#8B5CF6",
  },
});
