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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ProgressBar } from "@/components/ProgressBar";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface CourseItemProps {
  title: string;
  icon: string;
  color: string;
  progress: number;
  lessons: string;
  available: boolean;
  onPress: () => void;
}

function CourseItem({ title, icon, color, progress, lessons, available, onPress }: CourseItemProps) {
  const handlePress = () => {
    if (available) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [
      styles.courseItem,
      !available && styles.courseItemLocked,
      pressed && available && { opacity: 0.9, transform: [{ scale: 0.98 }] },
    ]}>
      <View style={[styles.courseIcon, { backgroundColor: available ? color : Colors.light.locked }]}>
        <Ionicons
          name={icon as any}
          size={24}
          color={available ? "#FFF" : Colors.light.lockedText}
        />
      </View>
      <View style={styles.courseInfo}>
        <Text style={[styles.courseTitle, !available && styles.courseTitleLocked]}>
          {title}
        </Text>
        <Text style={styles.courseLessons}>{lessons}</Text>
        {available && (
          <View style={styles.courseProgress}>
            <ProgressBar progress={progress} height={6} />
          </View>
        )}
      </View>
      {available ? (
        <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
      ) : (
        <Ionicons name="lock-closed" size={18} color={Colors.light.lockedText} />
      )}
    </Pressable>
  );
}

export default function StudyScreen() {
  const insets = useSafeAreaInsets();
  const { subCategories } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const courses = [
    {
      title: "문학",
      icon: "book",
      color: Colors.light.tint,
      progress: 0.25,
      lessons: "4개 단원",
      available: true,
      route: "/study/literature",
    },
    {
      title: "독서 (비문학)",
      icon: "document-text",
      color: "#4A90D9",
      progress: 0,
      lessons: "3개 단원",
      available: false,
      route: "",
    },
    {
      title: "화법과 작문",
      icon: "chatbubbles",
      color: "#7B61FF",
      progress: 0,
      lessons: "2개 단원",
      available: false,
      route: "",
    },
    {
      title: "언어와 매체",
      icon: "language",
      color: "#00B4D8",
      progress: 0,
      lessons: "3개 단원",
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
        <Text style={styles.pageSubtitle}>국어 영역</Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {subCategories.filter((c) => c.unlocked).length}
              </Text>
              <Text style={styles.overviewLabel}>활성 단원</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {subCategories.reduce((sum, c) => sum + c.completedLessons, 0)}
              </Text>
              <Text style={styles.overviewLabel}>완료 레슨</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {subCategories.reduce((sum, c) => sum + c.totalLessons, 0)}
              </Text>
              <Text style={styles.overviewLabel}>전체 레슨</Text>
            </View>
          </View>
        </View>

        <View style={styles.courseList}>
          {courses.map((course) => (
            <CourseItem
              key={course.title}
              title={course.title}
              icon={course.icon}
              color={course.color}
              progress={course.progress}
              lessons={course.lessons}
              available={course.available}
              onPress={() => {
                if (course.route) router.push(course.route as any);
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
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
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
  courseList: {
    gap: 12,
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
    shadowOpacity: 0.06,
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
  courseTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  courseTitleLocked: {
    color: Colors.light.lockedText,
  },
  courseLessons: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  courseProgress: {
    marginTop: 4,
  },
});
