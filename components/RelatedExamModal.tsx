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

// Colors.primary가 없으므로 Colors.light.tint 사용
const PRIMARY_COLOR = Colors.light.tint;

// Colors.gray가 없으므로 파일 내부에 회색조 정의
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
  questions: RelatedExamQuestion[]; // 단일 객체(exam)에서 배열(questions)로 변경
  quizId?: string; // 부모에서 넘겨주는 prop 허용 (사용은 안 하더라도 타입 에러 방지)
  parentQuizData?: any;
}

export function RelatedExamModal({
  visible,
  onClose,
  questions,
}: RelatedExamModalProps) {
  // 현재 풀고 있는 문제의 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  // 정답 확인 여부
  const [isSolved, setIsSolved] = useState(false);
  // 사용자가 맞췄는지 여부
  const [isUserCorrect, setIsUserCorrect] = useState(false);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setIsSolved(false);
      setIsUserCorrect(false);
    }
  }, [visible]);

  // questions가 없거나 비어있으면 렌더링 안 함
  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // O/X 버튼 클릭 핸들러
  const handleAnswer = (userChoice: "O" | "X") => {
    const isTrue = userChoice === "O";
    const correct = isTrue === currentQuestion.isTrue;

    setIsUserCorrect(correct);
    setIsSolved(true);
  };

  // 다음 문제로 이동 핸들러
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
            showsVerticalScrollIndicator={false}
          >
            {/* 연관 작품 지문 표시 */}
            {currentQuestion.relatedPassage && (
              <View style={styles.passageContainer}>
                <Text style={styles.passageLabel}>[연관 작품]</Text>
                <Text style={styles.passageText}>
                  {currentQuestion.relatedPassage}
                </Text>
              </View>
            )}

            {/* 문제 질문 */}
            <View style={styles.questionBox}>
              <Text style={styles.statement}>{currentQuestion.statement}</Text>
            </View>

            {/* 정답 및 해설 영역 (풀기 전에는 숨김) */}
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

          {/* 하단 컨트롤 영역 */}
          <View style={styles.footer}>
            {!isSolved ? (
              // 풀기 전: O/X 버튼
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
              // 푼 후: 다음 문제 버튼
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
    height: "70%", // 높이 고정 (스크롤을 위해)
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
    padding: 24,
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
  },
  questionBox: {
    marginBottom: 20,
  },
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
