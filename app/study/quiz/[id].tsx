// app/study/quiz/[id].tsx

import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, SlideInRight } from "react-native-reanimated";
import { ProgressBar } from "@/components/ProgressBar";
import { CheetahMascot } from "@/components/CheetahMascot";
import {
  getQuizById,
  NarrativePhase,
  CharacterMapData,
  NarrativeSection,
} from "@/data/quizData";
import { RelatedExamModal } from "@/components/RelatedExamModal";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

// --- Types & Constants ---

type AnswerState = "unanswered" | "correct" | "incorrect";

const phaseLabels: Record<NarrativePhase, string> = {
  exposition: "발단",
  rising: "전개",
  climax: "절정",
  falling: "하강",
  resolution: "결말",
};
const phaseOrder: NarrativePhase[] = [
  "exposition",
  "rising",
  "climax",
  "falling",
  "resolution",
];

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
            <Ionicons name="close" size={28} color={Colors.light.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.modalContentText}>{content}</Text>
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
            const section = sections.find((s) => s.phase === phase);
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

          <Text
            style={[styles.modalTitle, { marginTop: 20, marginBottom: 10 }]}
          >
            관계
          </Text>
          <View style={{ gap: 8 }}>
            {data.relations.map((r, i) => (
              <View key={i} style={styles.relRow}>
                <Text style={{ fontWeight: "bold" }}>{r.from}</Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{ fontSize: 10, color: "#888", marginBottom: 2 }}
                  >
                    {r.label}
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#DDD",
                      width: "100%",
                    }}
                  />
                </View>
                <Text style={{ fontWeight: "bold" }}>{r.to}</Text>
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
  const [results, setResults] = useState<boolean[]>([]);

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

  if (!quiz)
    return (
      <View style={styles.container}>
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
  const isClassicNovel = quiz.categoryId === "classic-novel";
  const isNovel = isModernNovel || isClassicNovel;

  // 지문 표시 로직: 현대어 모드면 modernText, 아니면 passage (전문)
  const passageToDisplay =
    showModern && quiz.modernText ? quiz.modernText : quiz.passage;
  const hasModernText = !!quiz.modernText;

  // 탭 버튼 렌더링 로직 (수특 전문 버튼 삭제됨)
  const renderTabs = () => {
    return (
      <View style={styles.tabRow}>
        {/* 소설류: 인물 관계도 */}
        {isNovel && quiz.characterMap && (
          <Pressable
            onPress={() => setShowCharacterMap(true)}
            style={styles.tabButton}
          >
            <Ionicons
              name="people-outline"
              size={16}
              color={Colors.light.tint}
            />
            <Text style={styles.tabButtonText}>인물 관계도</Text>
          </Pressable>
        )}

        {/* 소설류: 전체 줄거리 */}
        {isNovel && quiz.narrativeSections && (
          <Pressable
            onPress={() => setShowFullPlot(true)}
            style={styles.tabButton}
          >
            <Ionicons
              name="git-network-outline"
              size={16}
              color={Colors.light.tint}
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
              color={Colors.light.tint}
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
    setResults((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("unanswered");
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
  };

  // [UI 모듈] 지문 영역
  const renderPassageArea = () => (
    <View style={styles.passageCard}>
      <View style={styles.passageHeaderRow}>
        <Text style={styles.passageLabel}>
          {isModernPoetry ? "작품 전문" : "지문 (전문)"}
        </Text>
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
      <Text style={styles.passageText} textBreakStrategy="simple">
        {passageToDisplay}
      </Text>
    </View>
  );

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
              isBookmarked(currentQuestion.id)
                ? removeBookmark(currentQuestion.id)
                : addBookmark({
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
            }}
          >
            <Ionicons
              name={currentBookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={Colors.light.tint}
            />
          </Pressable>
        </View>
        <Text style={styles.qText} textBreakStrategy="simple">
          {currentQuestion.statement}
        </Text>
      </Animated.View>

      {answerState !== "unanswered" && (
        <Animated.View entering={FadeInDown} style={styles.feedbackSection}>
          <CheetahMascot
            size={60}
            mood={answerState === "correct" ? "happy" : "sad"}
          />
          <View style={styles.explanationBox}>
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.light.tint,
                marginBottom: 4,
              }}
            >
              해설
            </Text>
            <Text style={styles.explanationText} textBreakStrategy="simple">
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
            {currentIndex < totalQuestions - 1 ? "다음 문제" : "결과 보기"}
          </Text>
        </Pressable>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "android" ? insets.top + 10 : insets.top,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.light.text} />
        </Pressable>
        <ProgressBar progress={progress} height={8} color={Colors.light.tint} />
        <Text style={styles.counter}>
          {currentIndex + 1}/{totalQuestions}
        </Text>
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
            contentContainerStyle={styles.scrollContent}
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
  counter: {
    fontFamily: "NotoSansKR_700Bold",
    color: Colors.light.tint,
    width: 40,
    textAlign: "right",
  },
  scrollContent: { padding: 20, paddingBottom: 120 },
  infoSection: { alignItems: "center", marginBottom: 16 },
  title: { fontFamily: "NotoSansKR_900Black", fontSize: 22 },
  author: { fontFamily: "NotoSansKR_400Regular", color: "#666" },

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
    marginBottom: 8,
  },
  passageLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleLabel: {
    fontSize: 12,
    color: "#888",
  },
  divider: { height: 1, backgroundColor: "#EEE", marginBottom: 12 },

  passageText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "NotoSansKR_400Regular",
    width: "100%",
    flexShrink: 1,
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
  relatedExamText: { color: "#8B5CF6", fontWeight: "bold", marginRight: 4 },

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
  qBadgeText: { color: "#FFF", fontWeight: "bold" },

  qText: {
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 26,
    width: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  feedbackSection: { alignItems: "center", gap: 10 },
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
  oxText: { fontSize: 24, fontWeight: "900", color: "#FFF" },
  nextBtn: {
    backgroundColor: Colors.light.tint,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },

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
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalContentText: { fontSize: 16, lineHeight: 26 },
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
  plotPhaseText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  plotTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 2 },
  plotSummary: { color: "#555", fontSize: 13 },

  // Character Map Styles
  charGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  charCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  charRoleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  charRoleText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  charName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  charDesc: { fontSize: 12, color: "#666" },
  relRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
  },
});
