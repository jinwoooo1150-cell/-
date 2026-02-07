import React from "react";
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
import { useStudy, BookmarkItem } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

function BookmarkCard({ item, index, onDelete }: { item: BookmarkItem; index: number; onDelete: (id: string) => void }) {
  const correctAnswer = item.isTrue ? "O" : "X";

  const handleDelete = () => {
    if (Platform.OS === "web") {
      onDelete(item.questionId);
    } else {
      Alert.alert(
        "삭제 확인",
        "이 북마크를 삭제하시겠습니까?",
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
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="bookmark" size={18} color={Colors.light.tint} />
          <Text style={styles.cardTitle} numberOfLines={1}>{item.quizTitle}</Text>
          <Text style={styles.cardAuthor}>{item.quizAuthor}</Text>
        </View>
        <Pressable onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
      <Text style={styles.statementText}>{item.statement}</Text>
      <View style={styles.answerRow}>
        <View style={styles.answerTag}>
          <Text style={styles.answerTagLabel}>정답:</Text>
          <Text style={[styles.answerTagValue, { color: Colors.light.success }]}>{correctAnswer}</Text>
        </View>
      </View>
      <View style={styles.explanationBox}>
        <Ionicons name="bulb" size={14} color={Colors.light.tint} />
        <Text style={styles.explanationText}>{item.explanation}</Text>
      </View>
    </Animated.View>
  );
}

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { bookmarks, removeBookmark } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleDelete = (questionId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    removeBookmark(questionId);
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
        <Text style={styles.headerTitle}>북마크</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{bookmarks.length}</Text>
        </View>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={48} color={Colors.light.textMuted} />
          <Text style={styles.emptyTitle}>북마크가 없습니다</Text>
          <Text style={styles.emptySubtitle}>퀴즈에서 북마크 아이콘을 눌러 문제를 저장하세요</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.questionId}
          renderItem={({ item, index }) => (
            <BookmarkCard item={item} index={index} onDelete={handleDelete} />
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
    backgroundColor: Colors.light.tint,
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
    borderLeftColor: Colors.light.tint,
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
