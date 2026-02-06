import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ProgressBar } from "@/components/ProgressBar";
import Colors from "@/constants/colors";

interface SubCategoryCardProps {
  name: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  onPress: () => void;
}

export function SubCategoryCard({
  name,
  icon,
  unlocked,
  progress,
  completedLessons,
  totalLessons,
  onPress,
}: SubCategoryCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    if (!unlocked) return;
    scale.value = withSpring(0.93, { damping: 15, stiffness: 300 });
    translateY.value = withTiming(3, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
  };

  const handlePress = () => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.card,
          !unlocked && styles.cardLocked,
          cardStyle,
        ]}
      >
        {!unlocked && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={16} color={Colors.light.lockedText} />
            </View>
          </View>
        )}
        <View style={[styles.bottomShadow, !unlocked && styles.bottomShadowLocked]} />
        <View style={[styles.cardInner, !unlocked && styles.cardInnerLocked]}>
          <View style={[styles.iconCircle, !unlocked && styles.iconCircleLocked]}>
            <Ionicons
              name={icon as any}
              size={28}
              color={unlocked ? Colors.light.tint : Colors.light.lockedText}
            />
          </View>
          <Text style={[styles.name, !unlocked && styles.nameLocked]}>{name}</Text>
          {unlocked ? (
            <View style={styles.progressSection}>
              <ProgressBar progress={progress} height={8} />
              <Text style={styles.lessonCount}>
                {completedLessons}/{totalLessons}
              </Text>
            </View>
          ) : (
            <Text style={styles.lockedLabel}>잠김</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLocked: {
    opacity: 0.7,
  },
  bottomShadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: Colors.light.tintDark,
  },
  bottomShadowLocked: {
    backgroundColor: "#D0C9C3",
  },
  cardInner: {
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    padding: 18,
    paddingBottom: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  cardInnerLocked: {
    borderColor: Colors.light.locked,
    backgroundColor: Colors.light.locked,
  },
  lockOverlay: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.light.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleLocked: {
    backgroundColor: "#F0EAE5",
  },
  name: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
  },
  nameLocked: {
    color: Colors.light.lockedText,
  },
  progressSection: {
    width: "100%",
    gap: 4,
    alignItems: "center",
  },
  lessonCount: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  lockedLabel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.lockedText,
  },
});
