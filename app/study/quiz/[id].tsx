// app/study/quiz/[id].tsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Switch,
  useWindowDimensions,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, SlideInRight, ZoomIn } from "react-native-reanimated";
import { ProgressBar } from "@/components/ProgressBar";
import {
  getQuizById,
  CharacterMapData,
  NarrativeSection,
} from "@/data/quizData";
import { RelatedExamModal } from "@/components/RelatedExamModal";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";
import { useAppTheme } from "@/hooks/useAppTheme";
import { renderMarkedPassage } from "@/lib/passageMarkers";

// --- Types & Constants ---

type AnswerState = "unanswered" | "correct" | "incorrect";

const phaseOrder = [
  "exposition",
  "rising",
  "falling",
  "climax",
  "resolution",
] as const;
const phaseLabels: Record<(typeof phaseOrder)[number], string> = {
  exposition: "발단",
  rising: "전개",
  falling: "위기",
  climax: "절정",
  resolution: "결말",
};

const phaseAliases: Record<string, (typeof phaseOrder)[number]> = {
  exposition: "exposition",
  "발단": "exposition",
  도입: "exposition",
  rising: "rising",
  전개: "rising",
  "전개 1": "rising",
  "전개 2": "rising",
  falling: "falling",
  위기: "falling",
  climax: "climax",
  절정: "climax",
  "절정/결말": "climax",
  resolution: "resolution",
  결말: "resolution",
};

function normalizePhase(phase: NarrativeSection["phase"]) {
  return phaseAliases[phase] ?? null;
}

// --- Modals ---

// [수정] 단순 텍스트 모달 (작품 해설용으로 재사용)
function SimpleTextModal({
  visible,
  onClose,
  title,
  content,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const formattedParagraphs = useMemo(() => {
    const normalized = content.replace(/\r\n/g, "\n").trim();
    if (!normalized) return [];

    const explicitParagraphs = normalized
      .split(/\n{2,}|\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (explicitParagraphs.length > 1) {
      return explicitParagraphs;
    }

    const sentences = normalized.match(/[^.!?\n]+[.!?]?/g)?.map((line) => line.trim()).filter(Boolean) ?? [];

    if (sentences.length <= 2) {
      return [normalized];
    }

    const autoParagraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      autoParagraphs.push(sentences.slice(i, i + 2).join(" "));
    }
    return autoParagraphs;
  }, [content]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { paddingTop: Platform.OS === "android" ? insets.top + 16 : 16 },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalScrollContent}>
          <View style={styles.modalContentCard}>
            {formattedParagraphs.map((paragraph, index) => (
              <Text
                key={`${paragraph.slice(0, 16)}-${index}`}
                style={[
                  styles.modalContentText,
                  index < formattedParagraphs.length - 1 && styles.modalContentParagraph,
                ]}
              >
                {paragraph}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function FullPlotModal({
  visible,
  onClose,
  sections,
}: {
  visible: boolean;
  onClose: () => void;
  sections: NarrativeSection[];
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { paddingTop: Platform.OS === "android" ? insets.top + 16 : 16 },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>전체 줄거리</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.light.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {phaseOrder.map((phase) => {
            const section = sections.find((s) => normalizePhase(s.phase) === phase);
            if (!section) return null;
            return (
              <View key={phase} style={styles.plotSectionItem}>
                <View style={styles.plotPhaseBadge}>
                  <Text style={styles.plotPhaseText}>{phaseLabels[phase]}</Text>
                </View>
                <Text style={styles.plotTitle}>{section.title}</Text>
                <Text style={styles.plotSummary}>{section.summary}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

function CharacterMapModal({
  visible,
  onClose,
  data,
}: {
  visible: boolean;
  onClose: () => void;
  data: CharacterMapData;
}) {
  const insets = useSafeAreaInsets();

  const compactRelations = useMemo(() =>
    data.relations.map((relation) => ({
      ...relation,
      shortLabel:
        relation.label.length > 18 ? `${relation.label.slice(0, 18).trim()}…` : relation.label,
    })),
  [data.relations]);

  const getRoleBg = (role: string) => {
    if (role.includes("주인공")) return Colors.light.tint;
    if (role.includes("적대자")) return "#EF4444";
    if (role.includes("조력자")) return "#3B82F6";
    return "#8B5CF6";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { paddingTop: Platform.OS === "android" ? insets.top + 16 : 16 },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>인물 관계도</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.light.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.charGrid}>
            {data.characters.map((c, i) => (
              <View key={i} style={styles.charCard}>
                <View
                  style={[
                    styles.charRoleBadge,
                    { backgroundColor: getRoleBg(c.role) },
                  ]}
                >
                  <Text style={styles.charRoleText}>{c.role}</Text>
                </View>
                <Text style={styles.charName}>{c.name}</Text>
                <Text style={styles.charDesc}>{c.description}</Text>
              </View>
            ))}
          </View>

          <View style={styles.relationSectionHeader}>
            <Ionicons name="git-network-outline" size={18} color="#4B5563" />
            <Text style={styles.relationSectionTitle}>관계</Text>
          </View>
          <View style={styles.relationList}>
            {compactRelations.map((r, i) => (
              <View key={i} style={styles.relCard}>
                <View style={styles.relNode}>
                  <Text style={styles.relCharacterName} numberOfLines={1}>
                    {r.from}
                  </Text>
                </View>

                <View style={styles.relConnectorArea}>
                  <View style={styles.relLine} />
                  <View style={styles.relArrowHead} />
                  <View style={styles.relLabelChip}>
                    <Text style={styles.relLabelText} numberOfLines={1}>
                      {r.shortLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.relNode}>
                  <Text style={styles.relCharacterName} numberOfLines={1}>
                    {r.to}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// --- Main Component ---

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  // 화면 크기 감지 (태블릿 가로모드 대응)
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const quiz = getQuizById(id);
  const {
    addIncorrectNote,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addCompletedWork,
    addLearningTime,
  } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [feedbackSectionY, setFeedbackSectionY] = useState(0);

  const mobileScrollRef = useRef<ScrollView>(null);

  // 현대어 풀이 토글 상태
  const [showModern, setShowModern] = useState(false);

  // Modal States
  const [showExamModal, setShowExamModal] = useState(false);
  const [showCharacterMap, setShowCharacterMap] = useState(false);
  const [showFullPlot, setShowFullPlot] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false); // 작품 해설 모달

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    return () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) addLearningTime(elapsed);
    };
  }, []);

  useEffect(() => {
    if (isLargeScreen || answerState === "unanswered") return;

    const scrollTarget = Math.max(feedbackSectionY - 24, 0);
    const frame = requestAnimationFrame(() => {
      mobileScrollRef.current?.scrollTo({ y: scrollTarget, animated: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [answerState, feedbackSectionY, isLargeScreen]);

  if (!quiz)
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text>Quiz not found</Text>
      </View>
    );

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const progress =
    (currentIndex + (answerState !== "unanswered" ? 1 : 0)) / totalQuestions;
  const currentBookmarked = isBookmarked(currentQuestion.id);

  // 갈래별 조건 확인
  const isModernPoetry = quiz.categoryId === "modern-poetry";
  const isModernNovel = quiz.categoryId === "modern-novel";
  const isClassicPoetry = quiz.categoryId === "classic-poetry";
  // [수정됨] 고전소설 카테고리 ID 통일 처리
  const isClassicNovel =
    quiz.categoryId === "classic-novel" ||
    quiz.categoryId === "classical-novel";
  const isNovel = isModernNovel || isClassicNovel;
  const hasCharacterMap = !!quiz.characterMap;
  const hasNarrativeSections = !!quiz.narrativeSections?.length;

  // 지문 표시 로직: 현대어 모드면 modernText, 아니면 passage (전문)
  const passageToDisplay =
    showModern && quiz.modernText ? quiz.modernText : quiz.passage;
  const hasModernText = !!quiz.modernText;

  // 탭 버튼 렌더링 로직 (수특 전문 버튼 삭제됨)
  const renderTabs = () => {
    return (
      <View style={styles.tabRow}>
        {/* 소설류: 인물 관계도 */}
        {(isNovel || hasCharacterMap) && quiz.characterMap && (
          <Pressable
            onPress={() => setShowCharacterMap(true)}
            style={styles.tabButton}
          >
            <Ionicons
              name="people-outline"
              size={16}
              color={theme.tint}
            />
            <Text style={styles.tabButtonText}>인물 관계도</Text>
          </Pressable>
        )}

        {/* 소설류: 전체 줄거리 */}
        {(isNovel || hasNarrativeSections) && hasNarrativeSections && (
          <Pressable
            onPress={() => setShowFullPlot(true)}
            style={styles.tabButton}
          >
            <Ionicons
              name="git-network-outline"
              size={16}
              color={theme.tint}
            />
            <Text style={styles.tabButtonText}>전체 줄거리</Text>
          </Pressable>
        )}

        {/* 고전시가 등: 작품 해설 (데이터가 있을 경우) */}
        {quiz.commentary && (
          <Pressable
            onPress={() => setShowCommentary(true)}
            style={styles.tabButton}
          >
            <Ionicons
              name="document-text-outline"
              size={16}
              color={theme.tint}
            />
            <Text style={styles.tabButtonText}>작품 해설</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const handleAnswer = (answer: "O" | "X") => {
    if (answerState !== "unanswered") return;
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
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("unanswered");
      setFeedbackSectionY(0);
    } else {
      addCompletedWork(quiz.id);
      router.replace({
        pathname: "/study/works",
        params: { categoryId: quiz.categoryId },
      });
    }
  };

  // [UI 모듈] 지문 영역
  const renderPassageArea = () => (
    <View style={styles.passageCard}>
      <View style={styles.passageHeaderRow}>
        <View style={styles.passageTitleGroup}>
          <View style={styles.passageBullet}>
            <Ionicons name="star" size={11} color="#B68A28" />
          </View>
          <Text style={styles.passageLabel}>
            {isModernPoetry ? "작품 전문" : "다음 글을 읽고 물음에 답하시오."}
          </Text>
        </View>
        {/* 현대어 해설 토글 */}
        {hasModernText && (
          <View style={styles.toggleContainer}>
            <Text
              style={[
                styles.toggleLabel,
                showModern && { color: Colors.light.tint, fontWeight: "bold" },
              ]}
            >
              현대어 해설
            </Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: Colors.light.tint + "80" }}
              thumbColor={showModern ? Colors.light.tint : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setShowModern}
              value={showModern}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.passageTextBox}>
        <Text style={styles.passageText} textBreakStrategy="simple">
          {renderMarkedPassage(
            passageToDisplay,
            currentQuestion.statement,
            styles.passageText,
            styles.highlightedPassageText,
          )}
        </Text>
      </View>
    </View>
  );

  const handleFeedbackLayout = (event: LayoutChangeEvent) => {
    setFeedbackSectionY(event.nativeEvent.layout.y);
  };

  // [UI 모듈] 문제 영역
  const renderQuestionArea = () => (
    <>
      <Animated.View
        key={currentIndex}
        entering={SlideInRight}
        style={styles.questionCard}
      >
        <View style={styles.qHeader}>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q{currentIndex + 1}</Text>
          </View>
          <Pressable
            onPress={() => {
              if (isBookmarked(currentQuestion.id)) {
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
            }}
          >
            <Ionicons
              name={currentBookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={theme.tint}
            />
          </Pressable>
        </View>
        <Text style={[styles.qText, { color: theme.text }]} textBreakStrategy="simple">
          {currentQuestion.statement}
        </Text>
      </Animated.View>

      {answerState !== "unanswered" && (
        <Animated.View entering={FadeInDown} style={styles.feedbackSection} onLayout={handleFeedbackLayout}>
          <Animated.View
            entering={ZoomIn.springify().damping(10).stiffness(200)}
            style={[
              styles.oxResultBadge,
              answerState === "correct"
                ? styles.oxResultCorrect
                : styles.oxResultIncorrect,
            ]}
          >
            <Text style={[
              styles.oxResultText,
              answerState === "correct"
                ? styles.oxResultTextCorrect
                : styles.oxResultTextIncorrect,
            ]}>
              {answerState === "correct" ? "O" : "X"}
            </Text>
          </Animated.View>
          <View style={[styles.explanationBox, { backgroundColor: theme.cream }]}>
            <Text
              style={{
                fontFamily: "NotoSansKR_700Bold",
                color: answerState === "correct" ? "#00A86B" : "#FF4B4B",
                marginBottom: 4,
              }}
            >
              {answerState === "correct" ? "정답" : "오답"} · 해설
            </Text>
            <Text style={[styles.explanationText, { color: theme.textSecondary }]} textBreakStrategy="simple">
              {currentQuestion.explanation}
            </Text>
          </View>
        </Animated.View>
      )}
    </>
  );

  // [UI 모듈] 하단 버튼 (O/X 또는 다음)
  const renderBottomButtons = () => (
    <>
      {answerState === "unanswered" ? (
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable
            onPress={() => handleAnswer("O")}
            style={[styles.oxBtn, { backgroundColor: Colors.light.tint }]}
          >
            <Text style={styles.oxText}>O</Text>
          </Pressable>
          <Pressable
            onPress={() => handleAnswer("X")}
            style={[styles.oxBtn, { backgroundColor: "#E07800" }]}
          >
            <Text style={styles.oxText}>X</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={handleNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {currentIndex < totalQuestions - 1 ? "다음 문제" : "학습 완료"}
          </Text>
        </Pressable>
      )}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "android" ? insets.top + 10 : insets.top,
            borderColor: theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.text} />
        </Pressable>
        <View style={styles.headerProgressContainer}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              progress={progress}
              height={8}
              color={theme.tint}
            />
          </View>
          <Text style={[styles.counter, { color: theme.tint }]}>
            {currentIndex + (answerState !== "unanswered" ? 1 : 0)}/
            {totalQuestions}
          </Text>
        </View>
      </View>

      {/* --- 레이아웃 분기 --- */}
      {isLargeScreen ? (
        // [태블릿] 2단 분할 레이아웃
        <View style={styles.splitLayoutContainer}>
          {/* 왼쪽 패널: 정보 + 지문 (스크롤) */}
          <View style={styles.splitLeftPanel}>
            <ScrollView
              contentContainerStyle={styles.splitScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.infoSection}>
                <Text style={styles.title}>{quiz.title}</Text>
                <Text style={styles.author}>{quiz.author}</Text>
              </View>
              {renderTabs()}
              {renderPassageArea()}
              {quiz.relatedExams && quiz.relatedExams.length > 0 && (
                <Pressable
                  onPress={() => setShowExamModal(true)}
                  style={styles.relatedExamButton}
                >
                  <Text style={styles.relatedExamText}>
                    연관 기출 풀기 ({quiz.relatedExams.length}문항)
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
                </Pressable>
              )}
            </ScrollView>
          </View>

          {/* 오른쪽 패널: 문제 + 피드백 (스크롤) + 하단 버튼 고정 */}
          <View style={styles.splitRightPanel}>
            <ScrollView
              contentContainerStyle={styles.splitScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderQuestionArea()}
            </ScrollView>
            <View style={styles.splitBottomBar}>{renderBottomButtons()}</View>
          </View>
        </View>
      ) : (
        // [모바일] 단일 스크롤 레이아웃
        <>
          <ScrollView
            ref={mobileScrollRef}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 180 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoSection}>
              <Text style={styles.title}>{quiz.title}</Text>
              <Text style={styles.author}>{quiz.author}</Text>
            </View>
            {renderTabs()}
            {renderPassageArea()}
            {quiz.relatedExams && quiz.relatedExams.length > 0 && (
              <Pressable
                onPress={() => setShowExamModal(true)}
                style={styles.relatedExamButton}
              >
                <Text style={styles.relatedExamText}>
                  연관 기출 풀기 ({quiz.relatedExams.length}문항)
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
              </Pressable>
            )}
            {renderQuestionArea()}
          </ScrollView>

          <View
            style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}
          >
            {renderBottomButtons()}
          </View>
        </>
      )}

      {/* Modals */}
      {showCharacterMap && quiz.characterMap && (
        <CharacterMapModal
          visible={showCharacterMap}
          onClose={() => setShowCharacterMap(false)}
          data={quiz.characterMap}
        />
      )}
      {showFullPlot && quiz.narrativeSections && (
        <FullPlotModal
          visible={showFullPlot}
          onClose={() => setShowFullPlot(false)}
          sections={quiz.narrativeSections}
        />
      )}
      {/* 작품 해설 모달 */}
      {showCommentary && quiz.commentary && (
        <SimpleTextModal
          visible={showCommentary}
          onClose={() => setShowCommentary(false)}
          title="작품 해설"
          content={quiz.commentary}
        />
      )}
      {showExamModal && quiz.relatedExams && (
        <RelatedExamModal
          visible={showExamModal}
          onClose={() => setShowExamModal(false)}
          questions={quiz.relatedExams}
          quizId={quiz.id}
          parentQuizData={quiz}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  closeButton: { padding: 4 },
  headerProgressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  progressBarWrapper: {
    flex: 1,
    minWidth: 0,
  },
  counter: {
    fontFamily: "NotoSansKR_500Medium",
    color: Colors.light.tint,
    flexShrink: 0,
    textAlign: "right",
  },
  scrollContent: { padding: 20, paddingBottom: 120 },
  infoSection: { alignItems: "center", marginBottom: 16 },
  title: { fontFamily: "NotoSansKR_500Medium", fontSize: 22 },
  author: { fontFamily: "NotoSansKR_500Medium", color: "#666" },

  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tabButtonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.text,
  },

  passageCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    width: "100%",
  },
  passageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  passageTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  passageBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FCE9A6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8C86E",
  },
  passageLabel: {
    fontSize: 16,
    color: "#262626",
    fontFamily: "NotoSansKR_700Bold",
    flexShrink: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleLabel: {
    fontSize: 12,
    color: "#888",
    fontFamily: "NotoSansKR_500Medium",
  },
  divider: { height: 1, backgroundColor: "#DFDFDF", marginBottom: 12 },

  passageText: {
    fontSize: 10.91,
    lineHeight: 21,
    color: "#2A2A2A",
    fontFamily: "NotoSansKR_400Regular",
    letterSpacing: 0.2,
    width: "100%",
    flexShrink: 1,
  },
  highlightedPassageText: {
    textDecorationLine: "underline",
    textDecorationColor: "#B68A28",
    backgroundColor: "#FFF7E0",
  },
  passageTextBox: {
    borderWidth: 1,
    borderColor: "#D2D2D2",
    borderRadius: 0,
    backgroundColor: "#FCFCFA",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  relatedExamButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3EEFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  relatedExamText: { color: "#8B5CF6", fontFamily: "NotoSansKR_700Bold", marginRight: 4 },

  questionCard: {
    backgroundColor: "#FFF5E6",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    width: "100%",
  },
  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  qBadge: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qBadgeText: { color: "#FFF", fontFamily: "NotoSansKR_700Bold" },

  qText: {
    fontSize: 10.91,
    lineHeight: 26,
    fontFamily: "NotoSansKR_400Regular",
    width: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  feedbackSection: { alignItems: "center", gap: 14 },
  oxResultBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  oxResultCorrect: {
    borderColor: "#00A86B",
    backgroundColor: "#E6F4EF",
  },
  oxResultIncorrect: {
    borderColor: "#FF4B4B",
    backgroundColor: "#FFF0F0",
  },
  oxResultText: {
    fontSize: 40,
    fontFamily: "NotoSansKR_900Black",
    lineHeight: 48,
  },
  oxResultTextCorrect: {
    color: "#00A86B",
  },
  oxResultTextIncorrect: {
    color: "#FF4B4B",
  },
  explanationBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    fontFamily: "NotoSansKR_400Regular",
    width: "100%",
    flexShrink: 1,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  oxBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  oxText: { fontSize: 24, fontFamily: "NotoSansKR_900Black", color: "#FFF" },
  nextBtn: {
    backgroundColor: Colors.light.tint,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: { fontSize: 18, fontFamily: "NotoSansKR_700Bold", color: "#FFF" },

  // Split Layout Styles
  splitLayoutContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.light.background,
  },
  splitLeftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#EEE",
  },
  splitRightPanel: {
    flex: 1,
    justifyContent: "space-between",
  },
  splitScrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  splitBottomBar: {
    padding: 24,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: "#FFF" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  modalTitle: { fontSize: 18, fontFamily: "NotoSansKR_700Bold" },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 28,
  },
  modalContentCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  modalContentText: {
    fontSize: 16,
    lineHeight: 30,
    color: "#1E293B",
    fontFamily: "NotoSansKR_400Regular",
  },
  modalContentParagraph: {
    marginBottom: 14,
  },
  plotSectionItem: {
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.tint,
    paddingLeft: 12,
  },
  plotPhaseBadge: {
    backgroundColor: Colors.light.tint,
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  plotPhaseText: { color: "#FFF", fontSize: 11, fontFamily: "NotoSansKR_700Bold" },
  plotTitle: { fontSize: 15, fontFamily: "NotoSansKR_700Bold", marginBottom: 2 },
  plotSummary: { color: "#555", fontSize: 13, fontFamily: "NotoSansKR_400Regular" },

  // Character Map Styles
  charGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  charCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  charRoleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  charRoleText: { color: "#FFF", fontSize: 10, fontFamily: "NotoSansKR_700Bold" },
  charName: { fontFamily: "NotoSansKR_700Bold", fontSize: 16, marginBottom: 4 },
  charDesc: { fontSize: 13, color: "#4B5563", lineHeight: 18, fontFamily: "NotoSansKR_400Regular" },
  relationSectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  relationSectionTitle: {
    fontSize: 20,
    fontFamily: "NotoSansKR_900Black",
    color: "#111827",
    letterSpacing: -0.3,
  },
  relationList: { gap: 10 },
  relCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  relNode: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  relCharacterName: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.light.text,
    fontFamily: "NotoSansKR_700Bold",
  },
  relConnectorArea: {
    width: 96,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  relLabelChip: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 88,
    zIndex: 1,
  },
  relLabelText: {
    fontSize: 10,
    color: "#C2410C",
    fontFamily: "NotoSansKR_500Medium",
  },
  relLine: {
    position: "absolute",
    left: 4,
    right: 14,
    height: 2,
    backgroundColor: "#CBD5E1",
    borderRadius: 999,
  },
  relArrowHead: {
    position: "absolute",
    right: 4,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 8,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#CBD5E1",
  },
});
