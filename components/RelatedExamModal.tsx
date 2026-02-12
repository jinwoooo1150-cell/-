import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors"; // Default import로 수정
import { RelatedExamQuestion } from "@/data/quizData";

// Colors.primary가 없으므로 Colors.light.tint 사용
const PRIMARY_COLOR = Colors.light.tint;

// Colors.gray가 없으므로 파일 내부에 회색조 정의 (Tailwind 스타일)
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
  exam: RelatedExamQuestion | null;
}

export function RelatedExamModal({
  visible,
  onClose,
  exam,
}: RelatedExamModalProps) {
  if (!exam) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>기출 연동</Text>
            </View>
            <Text style={styles.source}>{exam.sourceTitle}</Text>
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
            {/* [New] 연관 작품 지문이 있으면 표시하는 영역 */}
            {exam.relatedPassage && (
              <View style={styles.passageContainer}>
                <Text style={styles.passageLabel}>[연관 작품]</Text>
                <Text style={styles.passageText}>{exam.relatedPassage}</Text>
              </View>
            )}

            <View style={styles.questionBox}>
              <Text style={styles.statement}>{exam.statement}</Text>
            </View>

            <View style={styles.answerSection}>
              <View
                style={[
                  styles.resultTag,
                  exam.isTrue ? styles.correctTag : styles.incorrectTag,
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    exam.isTrue ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  정답: {exam.isTrue ? "O" : "X"}
                </Text>
              </View>
              <Text style={styles.explanation}>{exam.explanation}</Text>
            </View>
          </ScrollView>
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
    maxHeight: "80%", // 모달 최대 높이 제한
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  badge: {
    backgroundColor: PRIMARY_COLOR + "15", // 투명도 추가
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
    flexGrow: 0, // 내용물만큼만 크기 차지
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
});
