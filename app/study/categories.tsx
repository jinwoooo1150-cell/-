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
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useStudy } from "@/contexts/StudyContext";
import { quizPassages } from "@/data/quizData";
import Colors from "@/constants/colors";

interface CategoryCardProps {
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

function CategoryCard({
  title,
  subtitle,
  icon,
  iconFamily = "Ionicons",
  color,
  available,
  index,
  count,
  completedCount,
  onPress,
}: CategoryCardProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <Pressable
        onPressIn={() => {
          if (available) scale.value = withSpring(0.96, { damping: 15 });
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
        <Animated.View style={[styles.categoryCard, pressStyle]}>
          <View
            style={[
              styles.categoryIconBox,
              { backgroundColor: available ? color : Colors.light.locked },
            ]}
          >
            {iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons
                name={icon as any}
                size={24}
                color={available ? "#FFF" : Colors.light.lockedText}
              />
            ) : (
              <Ionicons
                name={icon as any}
                size={24}
                color={available ? "#FFF" : Colors.light.lockedText}
              />
            )}
          </View>
          <View style={styles.categoryTextSection}>
            <Text
              style={[
                styles.categoryTitle,
                !available && { color: Colors.light.lockedText },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.categorySubtitle,
                !available && { color: Colors.light.lockedText },
              ]}
            >
              {subtitle}
            </Text>
          </View>
          <View style={styles.categoryRight}>
            {available ? (
              <>
                <Text style={styles.categoryCount}>
                  {completedCount}/{count}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.light.textMuted}
                />
              </>
            ) : (
              <View style={styles.lockBadge}>
                <Ionicons
                  name="lock-closed"
                  size={12}
                  color={Colors.light.lockedText}
                />
                <Text style={styles.lockText}>준비중</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { completedWorks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const getCountForCategory = (catId: string) =>
    quizPassages.filter((q) => q.categoryId === catId).length;

  const getCompletedForCategory = (catId: string) =>
    quizPassages.filter(
      (q) => q.categoryId === catId && completedWorks.includes(q.id),
    ).length;

  const categories = [
    {
      title: "현대시",
      subtitle: "Modern Poetry",
      icon: "musical-notes",
      color: "#FF8C00",
      available: true,
      route: "modern-poetry",
    },
    {
      title: "현대소설",
      subtitle: "Modern Fiction",
      icon: "book",
      color: "#E07800",
      available: true,
      route: "modern-novel",
    },
    {
      title: "고전시가",
      subtitle: "Classical Poetry",
      icon: "leaf",
      color: "#D4A017",
      available: true,
      route: "classic-poetry",
    },
    {
      title: "고전소설",
      subtitle: "Classical Fiction",
      icon: "library",
      color: "#C77800",
      available: true,
      route: "classic-novel",
    },
    {
      title: "극 · 수필",
      subtitle: "Drama & Essay",
      icon: "drama-masks",
      iconFamily: "MaterialCommunityIcons" as const,
      color: "#B0B0B0",
      available: false,
      route: "",
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12,
          },
        ]}
      >
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
          <Ionicons name="book" size={20} color={Colors.light.tint} />
          <Text style={styles.headerTitle}>문학 갈래별 학습</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              (Platform.OS === "web" ? webBottomInset : insets.bottom) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>갈래 선택</Text>
        <Text style={styles.sectionSubtitle}>
          원하는 갈래를 자유롭게 선택하세요
        </Text>

        <View style={styles.categoryList}>
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.title}
              title={cat.title}
              subtitle={cat.subtitle}
              icon={cat.icon}
              iconFamily={(cat.iconFamily || "Ionicons") as any}
              color={cat.color}
              available={cat.available}
              index={index}
              count={cat.available ? getCountForCategory(cat.route) : 0}
              completedCount={
                cat.available ? getCompletedForCategory(cat.route) : 0
              }
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
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
    marginBottom: 20,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTextSection: {
    flex: 1,
    gap: 2,
  },
  categoryTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: Colors.light.text,
  },
  categorySubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  categoryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryCount: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: Colors.light.tint,
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.locked,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  lockText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 11,
    color: Colors.light.lockedText,
  },
});
