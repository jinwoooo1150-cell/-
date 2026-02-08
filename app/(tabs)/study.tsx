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
import { LinearGradient } from "expo-linear-gradient";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface GrandUnitCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
  colors: string[];
  available: boolean;
  index: number;
  count: string;
  onPress: () => void;
}

function GrandUnitCard({ title, subtitle, description, icon, iconFamily = "Ionicons", colors, available, index, count, onPress }: GrandUnitCardProps) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (available) scale.value = withSpring(0.96, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 120).duration(500)}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (available) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }}
      >
        <Animated.View style={pressStyle}>
          <LinearGradient
            colors={available ? colors as [string, string, ...string[]] : ["#E5E7EB", "#D1D5DB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.grandUnitCard,
              available && styles.grandUnitCardShadow,
            ]}
          >
            <View style={styles.grandUnitCardInner}>
              <View style={styles.grandUnitLeft}>
                <View style={styles.grandUnitIconBox}>
                  {iconFamily === "MaterialCommunityIcons" ? (
                    <MaterialCommunityIcons name={icon as any} size={32} color={available ? "#FFF" : "#9CA3AF"} />
                  ) : (
                    <Ionicons name={icon as any} size={32} color={available ? "#FFF" : "#9CA3AF"} />
                  )}
                </View>
              </View>
              <View style={styles.grandUnitRight}>
                <View style={styles.grandUnitTitleRow}>
                  <Text style={[styles.grandUnitTitle, !available && styles.grandUnitTitleLocked]}>{title}</Text>
                  {!available && (
                    <View style={styles.comingSoonBadge}>
                      <Ionicons name="lock-closed" size={10} color="#9CA3AF" />
                      <Text style={styles.comingSoonText}>준비중</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.grandUnitSubtitle, !available && styles.grandUnitSubtitleLocked]}>{subtitle}</Text>
                <Text style={[styles.grandUnitDescription, !available && styles.grandUnitDescLocked]}>{description}</Text>
                {available && (
                  <View style={styles.grandUnitCountRow}>
                    <Ionicons name="layers" size={14} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.grandUnitCount}>{count}</Text>
                  </View>
                )}
              </View>
            </View>
            {available && (
              <View style={styles.grandUnitArrow}>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.6)" />
              </View>
            )}
            <View style={styles.grandUnitDecor1} />
            <View style={styles.grandUnitDecor2} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function StudyScreen() {
  const insets = useSafeAreaInsets();
  const { subCategories, incorrectNotes, bookmarks } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

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
        <Text style={styles.pageSubtitle}>수능 영역별 학습</Text>

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

        <Text style={styles.sectionTitle}>영역 선택</Text>
        <Text style={styles.sectionSubtitle}>학습할 대단원을 선택하세요</Text>

        <View style={styles.grandUnitList}>
          <GrandUnitCard
            title="문학"
            subtitle="Literature"
            description="현대시, 현대소설, 고전시가, 고전소설 등 문학 갈래별 학습"
            icon="book"
            colors={["#FF8C00", "#E07800", "#C86800"]}
            available={true}
            index={0}
            count="4개 갈래"
            onPress={() => {
              router.push("/study/categories" as any);
            }}
          />
          <GrandUnitCard
            title="독서"
            subtitle="Non-fiction"
            description="인문, 사회, 과학, 기술, 예술 영역 비문학 독해"
            icon="newspaper"
            colors={["#3B82F6", "#2563EB"]}
            available={false}
            index={1}
            count=""
            onPress={() => {}}
          />
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
  grandUnitList: {
    gap: 16,
  },
  grandUnitCard: {
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
  },
  grandUnitCardShadow: {
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  grandUnitCardInner: {
    flexDirection: "row",
    padding: 24,
    gap: 18,
  },
  grandUnitLeft: {
    justifyContent: "center",
  },
  grandUnitIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  grandUnitRight: {
    flex: 1,
    gap: 3,
  },
  grandUnitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  grandUnitTitle: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 26,
    color: "#FFF",
  },
  grandUnitTitleLocked: {
    color: "#9CA3AF",
  },
  grandUnitSubtitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  grandUnitSubtitleLocked: {
    color: "#9CA3AF",
  },
  grandUnitDescription: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 18,
    marginTop: 4,
  },
  grandUnitDescLocked: {
    color: "#B0B0B0",
  },
  grandUnitCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  grandUnitCount: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  comingSoonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  comingSoonText: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
  },
  grandUnitArrow: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -12,
  },
  grandUnitDecor1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  grandUnitDecor2: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
});
