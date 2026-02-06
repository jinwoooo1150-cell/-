import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
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

const { width, height } = Dimensions.get("window");

interface SplashOverlayProps {
  onFinish: () => void;
}

export function SplashOverlay({ onFinish }: SplashOverlayProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withDelay(800, withTiming(0, { duration: 400 }))
    );
    scale.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
      withDelay(800, withTiming(1.1, { duration: 400 }))
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
        <View style={styles.cheetahFace}>
          <View style={styles.earLeft} />
          <View style={styles.earRight} />
          <View style={styles.head}>
            <View style={styles.eyeLeft}>
              <View style={styles.pupil} />
            </View>
            <View style={styles.eyeRight}>
              <View style={styles.pupil} />
            </View>
            <View style={styles.nose} />
            <View style={styles.mouth} />
            <View style={styles.spotLeft} />
            <View style={styles.spotRight} />
            <View style={styles.spotTopLeft} />
            <View style={styles.spotTopRight} />
          </View>
        </View>
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
  cheetahFace: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  head: {
    width: 100,
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  earLeft: {
    position: "absolute",
    top: 5,
    left: 12,
    width: 28,
    height: 28,
    backgroundColor: "#FFF",
    borderRadius: 14,
    transform: [{ rotate: "-20deg" }],
    zIndex: -1,
  },
  earRight: {
    position: "absolute",
    top: 5,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: "#FFF",
    borderRadius: 14,
    transform: [{ rotate: "20deg" }],
    zIndex: -1,
  },
  eyeLeft: {
    position: "absolute",
    top: 28,
    left: 22,
    width: 18,
    height: 20,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeRight: {
    position: "absolute",
    top: 28,
    right: 22,
    width: 18,
    height: 20,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    width: 8,
    height: 10,
    backgroundColor: "#2D1B0E",
    borderRadius: 5,
    marginTop: 2,
  },
  nose: {
    position: "absolute",
    top: 50,
    width: 12,
    height: 8,
    backgroundColor: "#2D1B0E",
    borderRadius: 6,
  },
  mouth: {
    position: "absolute",
    top: 58,
    width: 20,
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#2D1B0E",
    backgroundColor: "transparent",
  },
  spotLeft: {
    position: "absolute",
    top: 35,
    left: 10,
    width: 6,
    height: 6,
    backgroundColor: Colors.light.tintLight,
    borderRadius: 3,
  },
  spotRight: {
    position: "absolute",
    top: 35,
    right: 10,
    width: 6,
    height: 6,
    backgroundColor: Colors.light.tintLight,
    borderRadius: 3,
  },
  spotTopLeft: {
    position: "absolute",
    top: 15,
    left: 25,
    width: 5,
    height: 5,
    backgroundColor: Colors.light.tintLight,
    borderRadius: 3,
  },
  spotTopRight: {
    position: "absolute",
    top: 15,
    right: 25,
    width: 5,
    height: 5,
    backgroundColor: Colors.light.tintLight,
    borderRadius: 3,
  },
});
