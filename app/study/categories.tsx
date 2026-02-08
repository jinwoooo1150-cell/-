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
  return (
    <View style={[styles.pathLine, { marginLeft: 30 }]}>
      <View style={styles.pathDot} />
      <View style={styles.pathDot} />
      <View style={styles.pathDot} />
    </View>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { completedWorks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

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
          <Ionicons name="book" size={20} color={Colors.light.tint} />
          <Text style={styles.headerTitle}>문학</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
});
