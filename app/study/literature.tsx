import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { SubCategoryCard } from "@/components/SubCategoryCard";
import { useStudy } from "@/contexts/StudyContext";
import { getQuizzesByCategory } from "@/data/quizData";
import Colors from "@/constants/colors";

const categoryQuizMap: Record<string, string> = {
  "modern-poetry": "modern-poem",
  "modern-novel": "modern-novel",
  "classic-poetry": "classic-poetry",
  "classic-novel": "classic-novel",
};

export default function LiteratureScreen() {
  const insets = useSafeAreaInsets();
  const { subCategories, incorrectNotes, bookmarks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleCategoryPress = (catId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const quizCategoryId = categoryQuizMap[catId];
    if (quizCategoryId) {
      const quizzes = getQuizzesByCategory(quizCategoryId);
      if (quizzes.length > 0) {
        router.push({ pathname: "/study/quiz/[id]", params: { id: quizzes[0].id } });
      }
    }
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
        <Text style={styles.headerTitle}>문학</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/incorrects");
            }}
            style={styles.headerIconButton}
          >
            <Ionicons name="alert-circle-outline" size={22} color="#EF4444" />
            {incorrectNotes.length > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeDotText}>{incorrectNotes.length}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/bookmarks");
            }}
            style={styles.headerIconButton}
          >
            <Ionicons name="bookmark-outline" size={22} color={Colors.light.tint} />
            {bookmarks.length > 0 && (
              <View style={[styles.badgeDot, { backgroundColor: Colors.light.tint }]}>
                <Text style={styles.badgeDotText}>{bookmarks.length}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={[styles.content, {
        paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
      }]}>
        <View style={styles.grid}>
          {subCategories.map((cat, index) => (
            <Animated.View
              key={cat.id}
              entering={Platform.OS !== "web" ? FadeInDown.delay(index * 100).springify() : undefined}
              style={styles.gridItem}
            >
              <SubCategoryCard
                name={cat.name}
                icon={cat.icon}
                unlocked={cat.unlocked}
                progress={cat.progress}
                completedLessons={cat.completedLessons}
                totalLessons={cat.totalLessons}
                onPress={() => handleCategoryPress(cat.id)}
              />
            </Animated.View>
          ))}
        </View>
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
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
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 4,
    right: 2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeDotText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 9,
    color: "#FFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  gridItem: {
    width: "46%",
  },
});
