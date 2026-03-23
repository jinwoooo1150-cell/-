import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStudy } from "@/contexts/StudyContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { RelatedExamQuestion } from "@/data/quizData";
import { renderMarkedPassage } from "@/lib/passageMarkers";

const Grays = {
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
};

interface RelatedExamModalProps {
  visible: boolean;
  onClose: () => void;
  questions: RelatedExamQuestion[];
  quizId?: string;
  parentQuizData?: any;
}

// 탭 타입 정의
type TabType = "passage" | "modern" | "commentary";

const TAB_LABELS: Record<TabType, string> = {
  passage: "원문",
  modern: "현대어",
  commentary: "해설",
};

const getSafeText = (value?: string) => {
  if (!value) return "";

  return value
    .replace(/\uFFFD+/g, " ")
    .replace(/�+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export function RelatedExamModal({
  visible,
  onClose,
  questions,
  quizId,
  parentQuizData,
}: RelatedExamModalProps) {
  const theme = useAppTheme();
  const { addBookmark, removeBookmark, isBookmarked } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isUserCorrect, setIsUserCorrect] = useState(false);

  // [추가] 현재 선택된 탭 상태 (기본값: 원문)
  const [activeTab, setActiveTab] = useState<TabType>("passage");

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setIsSolved(false);
      setIsUserCorrect(false);
      setActiveTab("passage"); // 모달 열릴 때 원문으로 초기화
    }
  }, [visible]);

  const currentQuestion = questions[currentIndex] ?? questions[0];
  const currentBookmarked = currentQuestion ? isBookmarked(currentQuestion.id) : false;
  const isLastQuestion = currentIndex === questions.length - 1;

  const availableTabs = useMemo(() => {
    if (!currentQuestion) return [];

    return (["passage", "modern", "commentary"] as TabType[]).filter(
      (tab) => {
        if (tab === "passage") return Boolean(currentQuestion.relatedPassage);
        if (tab === "modern") return Boolean(currentQuestion.relatedModernText);
        return Boolean(currentQuestion.relatedCommentary);
      },
    );
  }, [currentQuestion]);

  useEffect(() => {
    if (!availableTabs.length) return;
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [activeTab, availableTabs]);

  if (!currentQuestion) return null;

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleAnswer = (userChoice: "O" | "X") => {
    const isTrue = userChoice === "O";
    const correct = isTrue === currentQuestion.isTrue;
    setIsUserCorrect(correct);
    setIsSolved(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onClose();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsSolved(false);
      setIsUserCorrect(false);
      setActiveTab("passage"); // 다음 문제로 넘어가면 원문으로 초기화
    }
  };

  // 현재 탭에 따른 텍스트 내용 반환
  const getTabContent = () => {
    switch (activeTab) {
      case "modern":
        return getSafeText(currentQuestion.relatedModernText);
      case "commentary":
        return getSafeText(currentQuestion.relatedCommentary);
      default:
        return getSafeText(currentQuestion.relatedPassage);
    }
  };

  const tabContent =
    getTabContent() ||
    (activeTab === "modern"
      ? "현대어 풀이가 제공되지 않습니다."
      : activeTab === "commentary"
        ? "작품 해설이 제공되지 않습니다."
        : "지문이 없습니다.");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerMeta}>
              <View style={[styles.badge, { backgroundColor: theme.tint + "22" }]}>
                <Text style={[styles.badgeText, { color: theme.tint }]}>
                  기출 연동 {currentIndex + 1}/{questions.length}
                </Text>
              </View>
              <Text style={[styles.source, { color: theme.text }]}>
                {currentQuestion.sourceTitle}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => {
                  if (currentBookmarked) {
                    removeBookmark(currentQuestion.id);
                    return;
                  }

                  addBookmark({
                    questionId: currentQuestion.id,
                    quizId: quizId ?? parentQuizData?.id ?? "related-exam",
                    quizTitle: parentQuizData?.title ?? "연관 기출",
                    quizAuthor: parentQuizData?.author ?? "기출 문제",
                    categoryId: parentQuizData?.categoryId ?? "related-exam",
                    statement: currentQuestion.statement,
                    isTrue: currentQuestion.isTrue,
                    explanation: currentQuestion.explanation,
                    sourceTitle: currentQuestion.sourceTitle,
                    noteType: "exam",
                    timestamp: Date.now(),
                  });
                }}
                hitSlop={10}
              >
                <Ionicons name={currentBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={theme.tint} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={[styles.content, { backgroundColor: theme.card }]}
            contentContainerStyle={styles.contentContainer}
          >
            {/* [수정] 탭 버튼 영역 */}
            {availableTabs.length > 0 && (
              <View style={[styles.passageContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={[styles.tabBar, { backgroundColor: theme.background }]}>
                  {availableTabs.map((tab) => (
                    <Pressable
                      key={tab}
                      onPress={() => handleTabChange(tab)}
                      style={[
                        styles.tabItem,
                        activeTab === tab && styles.activeTabItem,
                        activeTab === tab && { backgroundColor: theme.card, borderColor: theme.tint },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          { color: theme.textMuted },
                          activeTab === tab && { color: theme.tint },
                        ]}
                      >
                        {TAB_LABELS[tab]}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <ScrollView style={styles.passageContent} nestedScrollEnabled>
                  <Text style={[styles.passageText, { color: theme.textSecondary }]}>
                    {activeTab === "passage"
                      ? renderMarkedPassage(
                          tabContent,
                          currentQuestion.statement,
                          styles.passageText,
                          styles.highlightedPassageText,
                        )
                      : tabContent}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* 문제 질문 */}
            <View style={[styles.questionBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.statement, { color: theme.text }]}>{currentQuestion.statement}</Text>
            </View>

            {/* 정답 및 해설 */}
            {isSolved && (
              <View style={[styles.answerSection, { backgroundColor: theme.background }]}>
                <View
                  style={[
                    styles.resultTag,
                    isUserCorrect ? styles.correctTag : styles.incorrectTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      isUserCorrect ? styles.correctText : styles.incorrectText,
                    ]}
                  >
                    {isUserCorrect ? "정답입니다!" : "오답입니다"} (정답:{" "}
                    {currentQuestion.isTrue ? "O" : "X"})
                  </Text>
                </View>
                <Text style={[styles.explanation, { color: theme.textSecondary }]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
            {!isSolved ? (
              <View style={styles.oxButtonContainer}>
                <Pressable
                  style={[styles.oxButton, { backgroundColor: theme.tint }]}
                  onPress={() => handleAnswer("O")}
                >
                  <Text style={styles.oxButtonText}>O</Text>
                </Pressable>
                <Pressable
                  style={[styles.oxButton, { backgroundColor: "#E07800" }]}
                  onPress={() => handleAnswer("X")}
                >
                  <Text style={styles.oxButtonText}>X</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={[styles.nextButton, { backgroundColor: theme.tint }]} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? "닫기" : "다음 문제"}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    height: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Grays[200],
    gap: 12,
  },
  headerMeta: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontFamily: "NotoSansKR_700Bold" },
  source: {
    fontSize: 14,
    color: Grays[500],
    fontFamily: "NotoSansKR_500Medium",
    lineHeight: 20,
    flexShrink: 1,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 2 },
  content: { flex: 1 },
  contentContainer: { padding: 24 },

  // 탭 스타일
  passageContainer: {
    backgroundColor: Grays[50],
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Grays[200],
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Grays[200],
    backgroundColor: "#fff",
  },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTabItem: { borderBottomWidth: 2 },
  tabText: { fontSize: 13, color: Grays[500], fontFamily: "NotoSansKR_500Medium" },
  passageContent: { padding: 16 },
  passageText: {
    fontSize: 10.91,
    color: Grays[800],
    lineHeight: 20,
    fontFamily: "NotoSansKR_400Regular",
  },
  highlightedPassageText: {
    textDecorationLine: "underline",
    textDecorationColor: "#B68A28",
    backgroundColor: "#FFF7E0",
  },
  questionBox: { marginBottom: 20 },
  statement: {
    fontSize: 18,
    fontFamily: "NotoSansKR_500Medium",
    color: Grays[900],
    lineHeight: 28,
  },
  answerSection: {
    backgroundColor: Grays[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  correctTag: { backgroundColor: "#E6F4F1" },
  incorrectTag: { backgroundColor: "#FFF0EB" },
  resultText: { fontSize: 14, fontFamily: "NotoSansKR_700Bold" },
  correctText: { color: "#00A86B" },
  incorrectText: { color: "#FF4B4B" },
  explanation: { fontSize: 15, color: Grays[700], lineHeight: 24, fontFamily: "NotoSansKR_400Regular" },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Grays[200],
    backgroundColor: "#FFF",
  },
  oxButtonContainer: { flexDirection: "row", gap: 12 },
  oxButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  oxButtonText: { color: "#FFF", fontSize: 20, fontFamily: "NotoSansKR_900Black" },
  nextButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: { color: "#FFF", fontSize: 16, fontFamily: "NotoSansKR_700Bold" },
});
