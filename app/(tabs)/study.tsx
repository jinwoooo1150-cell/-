import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useStudy } from "@/contexts/StudyContext";
import { quizPassages } from "@/data/quizData";
import Colors from "@/constants/colors";

interface LitCategoryItemProps {
  title: string;
  subtitle: string;
  icon: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  color: string;
  available: boolean;
  index: number;
  count: number;
  completedCount: number;
  onPress: () => void;
}

function LitCategoryItem({ title, subtitle, icon, iconFamily = "Ionicons", color, available, index, count, completedCount, onPress }: LitCategoryItemProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
      <Pressable
        onPressIn={() => {
          if (available) scale.value = withSpring(0.97, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={() => {
          if (available) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }}
      >
        <Animated.View style={[styles.litCard, pressStyle]}>
          <View style={[styles.litIconBox, { backgroundColor: available ? color : Colors.light.locked }]}>
            {iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons name={icon as any} size={22} color={available ? "#FFF" : Colors.light.lockedText} />
            ) : (
              <Ionicons name={icon as any} size={22} color={available ? "#FFF" : Colors.light.lockedText} />
            )}
          </View>
          <View style={styles.litTextSection}>
            <Text style={[styles.litTitle, !available && { color: Colors.light.lockedText }]}>{title}</Text>
            <Text style={[styles.litSubtitle, !available && { color: Colors.light.lockedText }]}>{subtitle}</Text>
          </View>
          {available ? (
            <View style={styles.litRight}>
              <Text style={styles.litCount}>{completedCount}/{count}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.textMuted} />
            </View>
          ) : (
            <View style={styles.litLockBadge}>
              <Ionicons name="lock-closed" size={11} color={Colors.light.lockedText} />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function StudyScreen() {
  const insets = useSafeAreaInsets();
  const { incorrectNotes, bookmarks, completedWorks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const getCountForCategory = (catId: string) =>
    quizPassages.filter((q) => q.categoryId === catId).length;
  const getCompletedForCategory = (catId: string) =>
    quizPassages.filter((q) => q.categoryId === catId && completedWorks.includes(q.id)).length;

  const litCategories = [
    { title: "현대시", subtitle: "Modern Poetry", icon: "musical-notes", color: "#FF8C00", available: true, route: "modern-poem" },
    { title: "현대소설", subtitle: "Modern Fiction", icon: "book", color: "#E07800", available: true, route: "modern-novel" },
    { title: "고전시가", subtitle: "Classical Poetry", icon: "leaf", color: "#D4A017", available: true, route: "classic-poetry" },
    { title: "고전소설", subtitle: "Classical Fiction", icon: "library", color: "#C77800", available: true, route: "classic-novel" },
    { title: "극 · 수필", subtitle: "Drama & Essay", icon: "drama-masks", iconFamily: "MaterialCommunityIcons" as const, color: "#B0B0B0", available: false, route: "" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 20,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>학습</Text>
        <Text style={styles.pageSubtitle}>문학 갈래별 학습</Text>

        <View style={styles.actionCardsRow}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/incorrects" as any);
            }}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#FFF0E0" }]}>
              <Ionicons name="alert-circle" size={22} color={Colors.light.tint} />
            </View>
            <Text style={styles.actionTitle}>나의 오답</Text>
            <Text style={styles.actionCount}>{incorrectNotes.length}개</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/study/bookmarks" as any);
            }}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#E8F4FF" }]}>
              <Ionicons name="bookmark" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.actionTitle}>북마크</Text>
            <Text style={styles.actionCount}>{bookmarks.length}개</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>문학 갈래</Text>
        <Text style={styles.sectionSubtitle}>원하는 갈래를 자유롭게 선택하세요</Text>

        <View style={styles.litList}>
          {litCategories.map((cat, index) => (
            <LitCategoryItem
              key={cat.title}
              title={cat.title}
              subtitle={cat.subtitle}
              icon={cat.icon}
              iconFamily={(cat.iconFamily || "Ionicons") as any}
              color={cat.color}
              available={cat.available}
              index={index}
              count={cat.available ? getCountForCategory(cat.route) : 0}
              completedCount={cat.available ? getCompletedForCategory(cat.route) : 0}
              onPress={() => {
                if (cat.route) {
                  router.push({
                    pathname: "/study/works",
                    params: { categoryId: cat.route },
                  } as any);
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 15,
    color: Colors.light.textMuted,
    marginBottom: 20,
  },
  actionCardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.text,
  },
  actionCount: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
    marginBottom: 16,
  },
  litList: {
    gap: 10,
  },
  litCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  litIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  litTextSection: {
    flex: 1,
    gap: 1,
  },
  litTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  litSubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  litRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  litCount: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: Colors.light.tint,
  },
  litLockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.locked,
    alignItems: "center",
    justifyContent: "center",
  },
});
