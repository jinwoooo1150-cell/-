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

// 테마 색상 안전하게 가져오기 (기본값 설정)
const PRIMARY_COLOR = Colors.light?.tint || "#2f95dc";

// 회색조 팔레트
const Grays = {
  50: "#F9FAFB",
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

export function RelatedExamModal({
  visible,
  onClose,
  questions,
}: RelatedExamModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isUserCorrect, setIsUserCorrect] = useState(false);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setIsSolved(false);
      setIsUserCorrect(false);
    }
  }, [visible]);

  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

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
            {/* 제목이 길 경우를 대비해 flex: 1 적용 */}
            <Text style={styles.source} numberOfLines={1}>
              {currentQuestion.sourceTitle}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Grays[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* [핵심 수정] 텍스트 줄바꿈 강제를 위한 Row Wrapper 패턴 적용 */}

            {/* 연관 작품 지문 표시 */}
            {currentQuestion.relatedPassage && (
              <View style={styles.passageContainer}>
                <Text style={styles.passageLabel}>[연관 작품]</Text>
                <View style={styles.textWrapper}>
                  <Text style={styles.passageText}>
                    {currentQuestion.relatedPassage}
                  </Text>
                </View>
              </View>
            )}

            {/* 문제 질문 */}
            <View style={styles.questionBox}>
              <View style={styles.textWrapper}>
                <Text style={styles.statement}>
                  {currentQuestion.statement}
                </Text>
              </View>
            </View>

            {/* 정답 및 해설 영역 */}
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
                <View style={styles.textWrapper}>
                  <Text style={styles.explanation}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
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
                {!isLastQuestion && (
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                )}
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
    height: "70%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
  badgeText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: "700",
  },
  source: {
    flex: 1,
    fontSize: 14,
    color: Grays[500],
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24, // 스크롤 뷰 내부 패딩
  },
  // [핵심] 줄바꿈을 강제하기 위한 래퍼 스타일
  textWrapper: {
    flexDirection: "row", // 가로 배치를 통해 너비 제약을 활성화
    width: "100%",
  },
  passageContainer: {
    backgroundColor: Grays[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Grays[200],
  },
  passageLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Grays[600],
    marginBottom: 8,
  },
  passageText: {
    fontSize: 14,
    color: Grays[800],
    lineHeight: 22,
    fontFamily: "NotoSansKR_400Regular",
    flex: 1, // 부모(Row)의 남은 공간을 채우면서
    flexWrap: "wrap", // 공간 부족 시 줄바꿈
  },
  questionBox: {
    marginBottom: 20,
    width: "100%",
  },
  statement: {
    fontSize: 18,
    fontWeight: "600",
    color: Grays[900],
    lineHeight: 28,
    flex: 1, // 부모(Row) 너비에 맞춰 줄바꿈 강제
    flexWrap: "wrap",
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
  correctTag: {
    backgroundColor: "#E6F4F1",
  },
  incorrectTag: {
    backgroundColor: "#FFF0EB",
  },
  resultText: {
    fontSize: 14,
    fontWeight: "700",
  },
  correctText: {
    color: "#00A86B",
  },
  incorrectText: {
    color: "#FF4B4B",
  },
  explanation: {
    fontSize: 15,
    color: Grays[700],
    lineHeight: 24,
    flex: 1, // 줄바꿈 강제
    flexWrap: "wrap",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Grays[200],
    backgroundColor: "#FFF",
  },
  oxButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  oxButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  oxButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
  },
  nextButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
