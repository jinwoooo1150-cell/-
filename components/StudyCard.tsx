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
import Colors from "@/constants/colors";

interface StudyCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  large?: boolean;
  color?: string;
}

export function StudyCard({
  title,
  subtitle,
  icon,
  onPress,
  large = false,
  color = Colors.light.tint,
}: StudyCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.15);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    translateY.value = withTiming(4, { duration: 100 });
    shadowOpacity.value = withTiming(0.05, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    shadowOpacity.value = withTiming(0.15, { duration: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
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
          large && styles.cardLarge,
          { backgroundColor: color },
          cardStyle,
          shadowStyle,
        ]}
      >
        <View style={[styles.bottomShadow, { backgroundColor: adjustColor(color, -30) }]} />
        <View style={[styles.cardInner, large && styles.cardInnerLarge, { backgroundColor: color }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={large ? 40 : 28} color="#FFF" />
          </View>
          <Text style={[styles.title, large && styles.titleLarge]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </Animated.View>
    </Pressable>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  cardLarge: {
    borderRadius: 22,
  },
  bottomShadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  cardInner: {
    borderRadius: 18,
    padding: 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 10,
  },
  cardInnerLarge: {
    borderRadius: 22,
    padding: 28,
    paddingBottom: 32,
    gap: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
  },
  titleLarge: {
    fontSize: 24,
  },
  subtitle: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
});
