import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const mascotImage = require("@/assets/images/mascot.png");

export type CheetahMood = "neutral" | "happy" | "sad" | "thinking";

interface CheetahMascotProps {
  size?: number;
  mood?: CheetahMood;
  speechBubble?: string;
}

function SpeechBubble({ text, size }: { text: string; size: number }) {
  const s = size / 100;
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [text]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{
      position: "absolute",
      top: -44 * s,
      left: -10 * s,
      right: -10 * s,
      backgroundColor: "#FFF",
      borderRadius: 14 * s,
      paddingHorizontal: 10 * s,
      paddingVertical: 6 * s,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      zIndex: 10,
      minWidth: 100 * s,
    }, animStyle]}>
      <Text style={{
        fontFamily: "NotoSansKR_500Medium",
        fontSize: 10 * s,
        color: Colors.light.text,
        textAlign: "center",
        lineHeight: 14 * s,
      }}>{text}</Text>
      <View style={{
        position: "absolute",
        bottom: -5 * s,
        left: "50%" as any,
        marginLeft: -6 * s,
        width: 0,
        height: 0,
        borderLeftWidth: 6 * s,
        borderRightWidth: 6 * s,
        borderTopWidth: 6 * s,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#FFF",
      }} />
    </Animated.View>
  );
}

export function CheetahMascot({ size = 100, mood = "neutral", speechBubble }: CheetahMascotProps) {
  const breathScale = useSharedValue(1);
  const bounceY = useSharedValue(0);
  const tiltAngle = useSharedValue(0);

  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    tiltAngle.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (mood === "happy") {
      bounceY.value = withSequence(
        withTiming(-10, { duration: 150 }),
        withSpring(0, { damping: 5, stiffness: 250 })
      );
    } else if (mood === "sad") {
      bounceY.value = withTiming(5, { duration: 400 });
    } else if (mood === "thinking") {
      tiltAngle.value = withSequence(
        withTiming(-8, { duration: 300 }),
        withTiming(-5, { duration: 200 })
      );
    } else {
      bounceY.value = withTiming(0, { duration: 300 });
    }
  }, [mood]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: breathScale.value },
      { translateY: bounceY.value },
      { rotate: `${tiltAngle.value}deg` },
    ],
  }));

  const moodOpacity = useAnimatedStyle(() => ({
    opacity: mood === "sad" ? 0.75 : 1,
  }));

  return (
    <View style={{ alignItems: "center" }}>
      {speechBubble && <SpeechBubble text={speechBubble} size={size} />}
      <Animated.View style={[{ width: size, height: size }, breathStyle, moodOpacity]}>
        <Image
          source={mascotImage}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({});
