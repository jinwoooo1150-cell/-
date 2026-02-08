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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { CheetahMascot } from "@/components/CheetahMascot";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface RoadmapNodeProps {
  title: string;
  subtitle: string;
  icon: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  color: string;
  available: boolean;
  completed: boolean;
  position: "left" | "center" | "right";
  index: number;
  onPress: () => void;
}

function RoadmapNode({ title, subtitle, icon, iconFamily = "Ionicons", color, available, completed, position, index, onPress }: RoadmapNodeProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (available) scale.value = withSpring(0.92, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const marginLeft = position === "left" ? 0 : position === "right" ? 140 : 70;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={{ marginLeft, marginBottom: 8 }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (available) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }}
      >
        <Animated.View style={[styles.nodeContainer, pressStyle]}>
          <View style={[
            styles.nodeCircle,
            {
              backgroundColor: available ? color : Colors.light.locked,
              shadowColor: available ? color : "transparent",
              shadowOpacity: available ? 0.35 : 0,
            },
            completed && styles.nodeCompleted,
          ]}>
            {completed ? (
              <Ionicons name="checkmark" size={28} color="#FFF" />
            ) : iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons name={icon as any} size={26} color={available ? "#FFF" : Colors.light.lockedText} />
            ) : (
              <Ionicons name={icon as any} size={26} color={available ? "#FFF" : Colors.light.lockedText} />
            )}
          </View>
          <View style={styles.nodeTextContainer}>
            <Text style={[styles.nodeTitle, !available && { color: Colors.light.lockedText }]}>{title}</Text>
            <Text style={[styles.nodeSubtitle, !available && { color: Colors.light.lockedText }]}>{subtitle}</Text>
          </View>
          {!available && (
            <Ionicons name="lock-closed" size={14} color={Colors.light.lockedText} style={{ marginLeft: 4 }} />
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function PathConnector({ fromPosition, toPosition }: { fromPosition: string; toPosition: string }) {
  const getPath = () => {
    if (fromPosition === "left" && toPosition === "center") return { marginLeft: 30, width: 60 };
    if (fromPosition === "center" && toPosition === "right") return { marginLeft: 95, width: 65 };
    if (fromPosition === "right" && toPosition === "left") return { marginLeft: 30, width: 140 };
    if (fromPosition === "left" && toPosition === "right") return { marginLeft: 30, width: 140 };
    if (fromPosition === "center" && toPosition === "left") return { marginLeft: 30, width: 60 };
    return { marginLeft: 50, width: 80 };
  };
  const path = getPath();
  return (
    <View style={[styles.pathLine, { marginLeft: path.marginLeft }]}>
      <View style={styles.pathDot} />
      <View style={styles.pathDot} />
      <View style={styles.pathDot} />
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { dailyProgress, streak, getDDay, completedWorks, subCategories } = useStudy();
  const dDay = getDDay();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const completedLessons = subCategories.reduce((sum, c) => sum + c.completedLessons, 0);
  const totalLessons = subCategories.reduce((sum, c) => sum + c.totalLessons, 0);

  const roadmapNodes = [
    {
      title: "현대시",
      subtitle: "Modern Poetry",
      icon: "musical-notes",
      color: "#FF8C00",
      available: true,
      completed: false,
      position: "left" as const,
      route: "modern-poem",
    },
    {
      title: "현대소설",
      subtitle: "Modern Fiction",
      icon: "book",
      color: "#E07800",
      available: true,
      completed: false,
      position: "center" as const,
      route: "modern-novel",
    },
    {
      title: "고전시가",
      subtitle: "Classical Poetry",
      icon: "leaf",
      color: "#D4A017",
      available: true,
      completed: false,
      position: "right" as const,
      route: "classic-poetry",
    },
    {
      title: "고전소설",
      subtitle: "Classical Fiction",
      icon: "library",
      color: "#C77800",
      available: true,
      completed: false,
      position: "left" as const,
      route: "classic-novel",
    },
    {
      title: "극 · 수필",
      subtitle: "Drama & Essay",
      icon: "drama-masks",
      iconFamily: "MaterialCommunityIcons" as const,
      color: "#B0B0B0",
      available: false,
      completed: false,
      position: "center" as const,
      route: "",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 12,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color={Colors.light.tint} />
            <Text style={styles.streakText}>{streak}일</Text>
          </View>
          <Text style={styles.appTitle}>Su-o-lingo</Text>
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={16} color="#FFB347" />
            <Text style={styles.xpText}>{completedLessons}</Text>
          </View>
        </View>

        <View style={styles.mascotSection}>
          <CheetahMascot size={80} mood="happy" />
        </View>

        <LinearGradient
          colors={["#FF8C00", "#E07800", "#C86800"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ddayCard}
        >
          <View style={styles.ddayInner}>
            <Text style={styles.ddayLabel}>2027학년도 대학수학능력시험</Text>
            <View style={styles.ddayCounterRow}>
              <Text style={styles.ddayPrefix}>D-</Text>
              <Text style={styles.ddayNumber}>{dDay}</Text>
            </View>
            <Text style={styles.ddayDate}>2026년 11월 12일 (목)</Text>
          </View>
          <View style={styles.ddayDecorCircle1} />
          <View style={styles.ddayDecorCircle2} />
        </LinearGradient>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{Math.round(dailyProgress * 100)}%</Text>
              <Text style={styles.progressLabel}>오늘 진도</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{completedWorks.length}</Text>
              <Text style={styles.progressLabel}>완료 작품</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>{streak}일</Text>
              <Text style={styles.progressLabel}>연속 학습</Text>
            </View>
          </View>
        </View>

        <View style={styles.roadmapSection}>
          <Text style={styles.sectionTitle}>학습 로드맵</Text>
          <Text style={styles.sectionSubtitle}>문학 갈래별 학습 경로</Text>

          <View style={styles.roadmapContainer}>
            {roadmapNodes.map((node, index) => (
              <React.Fragment key={node.title}>
                <RoadmapNode
                  title={node.title}
                  subtitle={node.subtitle}
                  icon={node.icon}
                  iconFamily={(node.iconFamily || "Ionicons") as any}
                  color={node.color}
                  available={node.available}
                  completed={node.completed}
                  position={node.position}
                  index={index}
                  onPress={() => {
                    if (node.route) {
                      router.push({
                        pathname: "/study/works",
                        params: { categoryId: node.route },
                      } as any);
                    }
                  }}
                />
                {index < roadmapNodes.length - 1 && (
                  <PathConnector
                    fromPosition={node.position}
                    toPosition={roadmapNodes[index + 1].position}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/study/literature");
          }}
          style={({ pressed }) => [
            styles.quickStartCard,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <LinearGradient
            colors={["#FF8C00", "#FFB347"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.quickStartGradient}
          >
            <Ionicons name="play" size={22} color="#FFF" />
            <Text style={styles.quickStartText}>학습 시작하기</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </Pressable>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  appTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.tint,
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  streakText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: Colors.light.tint,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  xpText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: "#FFB347",
  },
  mascotSection: {
    alignItems: "center",
    marginVertical: 4,
  },
  ddayCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ddayInner: {
    padding: 28,
    alignItems: "center",
    gap: 4,
  },
  ddayLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
  },
  ddayCounterRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ddayPrefix: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 36,
    color: "#FFF",
  },
  ddayNumber: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 56,
    color: "#FFF",
    lineHeight: 64,
  },
  ddayDate: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },
  ddayDecorCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  ddayDecorCircle2: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  progressCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  progressDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  progressValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 20,
    color: Colors.light.tint,
  },
  progressLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  roadmapSection: {
    marginBottom: 24,
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
    marginBottom: 16,
  },
  roadmapContainer: {
    paddingVertical: 8,
  },
  nodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nodeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  nodeCompleted: {
    borderWidth: 3,
    borderColor: Colors.light.success,
  },
  nodeTextContainer: {
    gap: 1,
  },
  nodeTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
  },
  nodeSubtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  pathLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  pathDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.tintGlow,
  },
  quickStartCard: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 8,
  },
  quickStartGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  quickStartText: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 17,
    color: "#FFF",
  },
});
