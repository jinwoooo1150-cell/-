import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useStudy, IncorrectNote, NoteType } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

type FilterType = "all" | "literature" | "vocab" | "exam";

function getItemType(item: IncorrectNote): NoteType {
  if (item.noteType) return item.noteType;
  if (item.correctAnswer) return "vocab";
  return "literature";
}

function IncorrectCard({ item, index, onDelete }: { item: IncorrectNote; index: number; onDelete: (id: string) => void }) {
  const itemType = getItemType(item);
  const isVocab = itemType === "vocab";
  const isExam = itemType === "exam";
  const correctAnswer = isVocab ? item.correctAnswer! : (item.isTrue ? "O" : "X");

  const borderColor = isExam ? "#8B5CF6" : isVocab ? "#00B4D8" : "#EF4444";
  const badgeColor = isExam ? "#8B5CF6" : isVocab ? "#00B4D8" : "#EF4444";
  const badgeIcon = isExam ? "school-outline" : isVocab ? "language" : "close";

  const handleDelete = () => {
    if (Platform.OS === "web") {
      onDelete(item.questionId);
    } else {
      Alert.alert(
        "삭제 확인",
        "이 오답 기록을 삭제하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: () => onDelete(item.questionId),
          },
        ]
      );
    }
  };

  return (
    <Animated.View
      entering={Platform.OS !== "web" ? FadeInDown.delay(index * 80).springify() : undefined}
      style={[styles.card, { borderLeftColor: borderColor }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.incorrectBadge, { backgroundColor: badgeColor }]}>
            <Ionicons name={badgeIcon as any} size={12} color="#FFF" />
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.quizTitle}</Text>
          {!isExam && <Text style={styles.cardAuthor}>{item.quizAuthor}</Text>}
        </View>
        <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
      {isExam && item.sourceTitle && (
        <View style={styles.sourceTag}>
          <Ionicons name="school-outline" size={11} color="#8B5CF6" />
          <Text style={styles.sourceTagText}>{item.sourceTitle}</Text>
          <Text style={styles.sourceTagSep}>|</Text>
          <Text style={styles.sourceTagWork}>{item.quizAuthor}</Text>
        </View>
      )}
      <Text style={styles.statementText}>{item.statement}</Text>
      {isVocab ? (
        <View style={styles.vocabAnswerColumn}>
          <View style={styles.vocabAnswerRow}>
            <Text style={styles.answerTagLabel}>내 답:</Text>
            <Text style={[styles.vocabAnswerText, { color: "#EF4444" }]}>{item.userAnswer}</Text>
          </View>
          <View style={styles.vocabAnswerRow}>
            <Text style={styles.answerTagLabel}>정답:</Text>
            <Text style={[styles.vocabAnswerText, { color: Colors.light.success }]}>{correctAnswer}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.answerRow}>
          <View style={styles.answerTag}>
            <Text style={styles.answerTagLabel}>내 답:</Text>
            <Text style={[styles.answerTagValue, { color: "#EF4444" }]}>{item.userAnswer}</Text>
          </View>
          <View style={styles.answerTag}>
            <Text style={styles.answerTagLabel}>정답:</Text>
            <Text style={[styles.answerTagValue, { color: Colors.light.success }]}>{correctAnswer}</Text>
          </View>
        </View>
      )}
      <View style={styles.explanationBox}>
        <Ionicons name="bulb" size={14} color={Colors.light.tint} />
        <Text style={styles.explanationText}>{item.explanation}</Text>
      </View>
    </Animated.View>
  );
}

const filterOptions: { key: FilterType; label: string; icon: string; color: string }[] = [
  { key: "all", label: "전체", icon: "apps", color: Colors.light.text },
  { key: "literature", label: "문학", icon: "book-outline", color: "#EF4444" },
  { key: "exam", label: "기출", icon: "school-outline", color: "#8B5CF6" },
  { key: "vocab", label: "어휘", icon: "language", color: "#00B4D8" },
];

export default function IncorrectsScreen() {
  const insets = useSafeAreaInsets();
  const { incorrectNotes, removeIncorrectNote } = useStudy();
  const [filter, setFilter] = useState<FilterType>("all");

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const filteredNotes = useMemo(() => {
    if (filter === "all") return incorrectNotes;
    return incorrectNotes.filter((n) => getItemType(n) === filter);
  }, [incorrectNotes, filter]);

  const handleDelete = (questionId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    removeIncorrectNote(questionId);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {
        paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12,
      }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>나의 오답</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{incorrectNotes.length}</Text>
        </View>
      </View>

      {incorrectNotes.length > 0 && (
        <View style={styles.filterRow}>
          {filterOptions.map((opt) => {
            const isActive = filter === opt.key;
            const count = opt.key === "all"
              ? incorrectNotes.length
              : incorrectNotes.filter((n) => getItemType(n) === opt.key).length;
            if (opt.key !== "all" && count === 0) return null;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilter(opt.key);
                }}
                style={[
                  styles.filterChip,
                  isActive && { backgroundColor: opt.color, borderColor: opt.color },
                ]}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={14}
                  color={isActive ? "#FFF" : opt.color}
                />
                <Text style={[styles.filterChipText, isActive && { color: "#FFF" }]}>
                  {opt.label} {count}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={48} color={Colors.light.success} />
          <Text style={styles.emptyTitle}>
            {incorrectNotes.length === 0 ? "오답이 없습니다" : "해당 유형의 오답이 없습니다"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {incorrectNotes.length === 0
              ? "퀴즈를 풀면 틀린 문제가 여기에 저장됩니다"
              : "다른 필터를 선택해보세요"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.questionId}
          renderItem={({ item, index }) => (
            <IncorrectCard item={item} index={index} onDelete={handleDelete} />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20 },
          ]}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  filterChipText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: Colors.light.text,
  },
  listContent: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  incorrectBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 15,
    color: Colors.light.text,
    flex: 1,
  },
  cardAuthor: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  sourceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  sourceTagText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 11,
    color: "#8B5CF6",
  },
  sourceTagSep: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 10,
    color: "#C4B5FD",
  },
  sourceTagWork: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: "#7C3AED",
  },
  statementText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.text,
  },
  answerRow: {
    flexDirection: "row",
    gap: 12,
  },
  answerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  answerTagLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  answerTagValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 14,
  },
  vocabAnswerColumn: {
    gap: 6,
  },
  vocabAnswerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vocabAnswerText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    flex: 1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  explanationBox: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: Colors.light.cream,
    padding: 12,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  explanationText: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: "center",
  },
});
