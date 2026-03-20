import React, { useEffect } from "react";
import { StyleSheet, Dimensions, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const mascotImage = require("@/assets/images/mascot.png");

const { width, height } = Dimensions.get("window");
const MASCOT_SIZE = Math.min(width, height) * 0.55;

interface SplashOverlayProps {
  onFinish: () => void;
}

export function SplashOverlay({ onFinish }: SplashOverlayProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withSequence(
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withDelay(900, withTiming(0, { duration: 400 }))
    );
    scale.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.4)) }),
      withDelay(900, withTiming(1.1, { duration: 400 }))
    );
    opacity.value = withDelay(
      1600,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={mascotImage}
          style={{ width: MASCOT_SIZE, height: MASCOT_SIZE }}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
