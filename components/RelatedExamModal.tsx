import React, { useState, useEffect } from "react";
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
import Colors from "@/constants/colors";
import { RelatedExamQuestion } from "@/data/quizData";

const PRIMARY_COLOR = Colors.light?.tint || "#2f95dc";
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

export function RelatedExamModal({
  visible,
  onClose,
  questions,
}: RelatedExamModalProps) {
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

  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

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
        return (
          currentQuestion.relatedModernText ||
          "현대어 풀이가 제공되지 않습니다."
        );
      case "commentary":
        return (
          currentQuestion.relatedCommentary || "작품 해설이 제공되지 않습니다."
        );
      default:
        return currentQuestion.relatedPassage || "지문이 없습니다.";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                기출 연동 {currentIndex + 1}/{questions.length}
              </Text>
            </View>
            <Text style={styles.source} numberOfLines={1}>
              {currentQuestion.sourceTitle}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={Grays[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
          >
            {/* [수정] 탭 버튼 영역 */}
            {(currentQuestion.relatedPassage ||
              currentQuestion.relatedModernText ||
              currentQuestion.relatedCommentary) && (
              <View style={styles.passageContainer}>
                <View style={styles.tabBar}>
                  <Pressable
                    onPress={() => handleTabChange("passage")}
                    style={[
                      styles.tabItem,
                      activeTab === "passage" && styles.activeTabItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "passage" && styles.activeTabText,
                      ]}
                    >
                      원문
                    </Text>
                  </Pressable>
                  {currentQuestion.relatedModernText && (
                    <Pressable
                      onPress={() => handleTabChange("modern")}
                      style={[
                        styles.tabItem,
                        activeTab === "modern" && styles.activeTabItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === "modern" && styles.activeTabText,
                        ]}
                      >
                        현대어
                      </Text>
                    </Pressable>
                  )}
                  {currentQuestion.relatedCommentary && (
                    <Pressable
                      onPress={() => handleTabChange("commentary")}
                      style={[
                        styles.tabItem,
                        activeTab === "commentary" && styles.activeTabItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === "commentary" && styles.activeTabText,
                        ]}
                      >
                        해설
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.passageContent}>
                  <Text style={styles.passageText}>{getTabContent()}</Text>
                </View>
              </View>
            )}

            {/* 문제 질문 */}
            <View style={styles.questionBox}>
              <Text style={styles.statement}>{currentQuestion.statement}</Text>
            </View>

            {/* 정답 및 해설 */}
            {isSolved && (
              <View style={styles.answerSection}>
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
                <Text style={styles.explanation}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {!isSolved ? (
              <View style={styles.oxButtonContainer}>
                <Pressable
                  style={[styles.oxButton, { backgroundColor: PRIMARY_COLOR }]}
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
              <Pressable style={styles.nextButton} onPress={handleNext}>
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
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Grays[200],
    gap: 8,
  },
  badge: {
    backgroundColor: PRIMARY_COLOR + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: PRIMARY_COLOR, fontSize: 12, fontWeight: "700" },
  source: { flex: 1, fontSize: 14, color: Grays[500], fontWeight: "500" },
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
  activeTabItem: { borderBottomWidth: 2, borderBottomColor: PRIMARY_COLOR },
  tabText: { fontSize: 13, color: Grays[500], fontWeight: "600" },
  activeTabText: { color: PRIMARY_COLOR },
  passageContent: { padding: 16 },
  passageText: {
    fontSize: 14,
    color: Grays[800],
    lineHeight: 22,
    fontFamily: "NotoSansKR_400Regular",
  },

  questionBox: { marginBottom: 20 },
  statement: {
    fontSize: 18,
    fontWeight: "600",
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
  resultText: { fontSize: 14, fontWeight: "700" },
  correctText: { color: "#00A86B" },
  incorrectText: { color: "#FF4B4B" },
  explanation: { fontSize: 15, color: Grays[700], lineHeight: 24 },
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
  oxButtonText: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  nextButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
