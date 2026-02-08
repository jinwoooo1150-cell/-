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
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "@/components/ProgressBar";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface CourseItemProps {
  title: string;
  icon: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  color: string;
  progress: number;
  comingSoon: boolean;
  available: boolean;
  index: number;
  onPress: () => void;
}

function CourseItem({ title, icon, iconFamily = "Ionicons", color, progress, comingSoon, available, index, onPress }: CourseItemProps) {
  const handlePress = () => {
    if (available) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <Pressable onPress={handlePress} style={({ pressed }) => [
        styles.courseItem,
        !available && styles.courseItemLocked,
        pressed && available && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}>
        <View style={[styles.courseIcon, { backgroundColor: available ? color : Colors.light.locked }]}>
          {iconFamily === "MaterialCommunityIcons" ? (
            <MaterialCommunityIcons name={icon as any} size={24} color={available ? "#FFF" : Colors.light.lockedText} />
          ) : (
            <Ionicons name={icon as any} size={24} color={available ? "#FFF" : Colors.light.lockedText} />
          )}
        </View>
        <View style={styles.courseInfo}>
          <View style={styles.courseTitleRow}>
            <Text style={[styles.courseTitle, !available && styles.courseTitleLocked]}>
              {title}
            </Text>
            {comingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>준비중</Text>
              </View>
            )}
          </View>
          {available && progress > 0 && (
            <View style={styles.courseProgress}>
              <ProgressBar progress={progress} height={6} color={color} />
            </View>
          )}
        </View>
        {available ? (
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        ) : (
          <Ionicons name="lock-closed" size={18} color={Colors.light.lockedText} />
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function StudyScreen() {
  const insets = useSafeAreaInsets();
  const { subCategories, incorrectNotes, bookmarks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const completedLessons = subCategories.reduce((sum, c) => sum + c.completedLessons, 0);
  const totalLessons = subCategories.reduce((sum, c) => sum + c.totalLessons, 0);

  const courses = [
    {
      title: "현대시",
      icon: "musical-notes",
      color: "#FF8C00",
      progress: 0,
      comingSoon: false,
      available: true,
      route: "modern-poem",
    },
    {
      title: "현대소설",
      icon: "book",
      color: "#E07800",
      progress: 0,
      comingSoon: false,
      available: true,
      route: "modern-novel",
    },
    {
      title: "고전시가",
      icon: "leaf",
      color: "#D4A017",
      progress: 0,
      comingSoon: false,
      available: true,
      route: "classic-poetry",
    },
    {
      title: "고전소설",
      icon: "library",
      color: "#C77800",
      progress: 0,
      comingSoon: false,
      available: true,
      route: "classic-novel",
    },
    {
      title: "극 · 수필",
      icon: "drama-masks",
      iconFamily: "MaterialCommunityIcons" as const,
      color: "#B0B0B0",
      progress: 0,
      comingSoon: true,
      available: false,
      route: "",
    },
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

        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{completedLessons}</Text>
              <Text style={styles.overviewLabel}>완료 레슨</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{totalLessons}</Text>
              <Text style={styles.overviewLabel}>전체 레슨</Text>
            </View>
          </View>
        </View>

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

        <Text style={styles.sectionTitle}>갈래별 학습</Text>
        <View style={styles.courseList}>
          {courses.map((course, index) => (
            <CourseItem
              key={course.title}
              title={course.title}
              icon={course.icon}
              iconFamily={(course.iconFamily || "Ionicons") as any}
              color={course.color}
              progress={course.progress}
              comingSoon={course.comingSoon}
              available={course.available}
              index={index}
              onPress={() => {
                if (course.route) router.push({
                  pathname: "/study/works",
                  params: { categoryId: course.route },
                } as any);
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
  overviewCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  overviewItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  overviewDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.light.border,
  },
  overviewValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 22,
    color: Colors.light.tint,
  },
  overviewLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
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
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  courseList: {
    gap: 10,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseItemLocked: {
    opacity: 0.6,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  courseInfo: {
    flex: 1,
    gap: 3,
  },
  courseTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courseTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  courseTitleLocked: {
    color: Colors.light.lockedText,
  },
  comingSoonBadge: {
    backgroundColor: Colors.light.cream,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  comingSoonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 10,
    color: Colors.light.tint,
  },
  courseProgress: {
    marginTop: 4,
  },
});
