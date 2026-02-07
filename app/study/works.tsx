import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useStudy } from "@/contexts/StudyContext";
import { getQuizzesByCategory, QuizPassage } from "@/data/quizData";
import Colors from "@/constants/colors";

const categoryNames: Record<string, string> = {
  "modern-poem": "현대시",
  "modern-novel": "현대소설",
  "classic-poetry": "고전시가",
  "classic-novel": "고전소설",
};

const categoryIcons: Record<string, string> = {
  "modern-poem": "flower-outline",
  "modern-novel": "book-outline",
  "classic-poetry": "leaf-outline",
  "classic-novel": "library-outline",
};

function WorkCard({
  item,
  index,
  isCompleted,
  onPress,
}: {
  item: QuizPassage;
  index: number;
  isCompleted: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={Platform.OS !== "web" ? FadeInDown.delay(index * 80).springify() : undefined}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animStyle]}>
          <View style={styles.cardContent}>
            <View style={styles.cardTextSection}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.author}  ·  {item.source}
              </Text>
              <View style={styles.questionCountRow}>
                <Ionicons name="help-circle-outline" size={14} color={Colors.light.textMuted} />
                <Text style={styles.questionCountText}>{item.questions.length}문항</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {isCompleted ? (
                <View style={styles.completedIcon}>
                  <Ionicons name="checkmark-circle" size={28} color={Colors.light.success} />
                </View>
              ) : (
                <View style={styles.startIcon}>
                  <Ionicons name="chevron-forward" size={22} color={Colors.light.tint} />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function WorksScreen() {
  const insets = useSafeAreaInsets();
  const { completedWorks } = useStudy();
  const params = useLocalSearchParams<{ category: string }>();
  const categoryId = params.category || "";

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const quizzes = getQuizzesByCategory(categoryId);
  const categoryName = categoryNames[categoryId] || "문학";
  const categoryIcon = categoryIcons[categoryId] || "book-outline";
  const completedCount = quizzes.filter((q) => completedWorks.includes(q.id)).length;

  const handleWorkPress = (quizId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/study/quiz/[id]", params: { id: quizId } });
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
        <View style={styles.headerCenter}>
          <Ionicons name={categoryIcon as any} size={20} color={Colors.light.tint} />
          <Text style={styles.headerTitle}>{categoryName}</Text>
        </View>
        <View style={styles.headerCountBadge}>
          <Text style={styles.headerCountText}>
            {completedCount}/{quizzes.length}
          </Text>
        </View>
      </View>

      {quizzes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color={Colors.light.textMuted} />
          <Text style={styles.emptyTitle}>준비 중입니다</Text>
          <Text style={styles.emptySubtitle}>곧 새로운 지문이 추가됩니다</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <WorkCard
              item={item}
              index={index}
              isCompleted={completedWorks.includes(item.id)}
              onPress={() => handleWorkPress(item.id)}
            />
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
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  headerCountBadge: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerCountText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 12,
    color: "#FFF",
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTextSection: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: Colors.light.text,
  },
  cardMeta: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  questionCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  questionCountText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  cardRight: {
    marginLeft: 12,
  },
  completedIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  startIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.cream,
    alignItems: "center",
    justifyContent: "center",
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
