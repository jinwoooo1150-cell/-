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

function MascotShape({ s }: { s: number }) {
  return (
    <View style={{ width: 140 * s, height: 160 * s, alignItems: "center" }}>
      {/* Body */}
      <View style={{
        position: "absolute",
        bottom: 0,
        width: 90 * s,
        height: 80 * s,
        backgroundColor: "#F5B942",
        borderRadius: 40 * s,
        alignItems: "center",
      }}>
        {/* Belly */}
        <View style={{
          position: "absolute",
          bottom: 8 * s,
          width: 50 * s,
          height: 55 * s,
          backgroundColor: "#FFF5DC",
          borderRadius: 25 * s,
        }} />
        {/* Body spots */}
        <View style={{ position: "absolute", top: 12 * s, left: 8 * s, width: 8 * s, height: 8 * s, borderRadius: 4 * s, backgroundColor: "#C97B22" }} />
        <View style={{ position: "absolute", top: 22 * s, left: 14 * s, width: 7 * s, height: 7 * s, borderRadius: 3.5 * s, backgroundColor: "#C97B22" }} />
        <View style={{ position: "absolute", top: 12 * s, right: 8 * s, width: 8 * s, height: 8 * s, borderRadius: 4 * s, backgroundColor: "#C97B22" }} />
        <View style={{ position: "absolute", top: 22 * s, right: 14 * s, width: 7 * s, height: 7 * s, borderRadius: 3.5 * s, backgroundColor: "#C97B22" }} />
        {/* Front paws */}
        <View style={{ position: "absolute", bottom: 0, left: 2 * s, width: 22 * s, height: 16 * s, backgroundColor: "#F5B942", borderRadius: 10 * s }} />
        <View style={{ position: "absolute", bottom: 0, right: 2 * s, width: 22 * s, height: 16 * s, backgroundColor: "#F5B942", borderRadius: 10 * s }} />
      </View>

      {/* Neck / head base */}
      <View style={{
        position: "absolute",
        bottom: 68 * s,
        width: 60 * s,
        height: 30 * s,
        backgroundColor: "#F5B942",
        borderRadius: 15 * s,
      }} />

      {/* Ears */}
      <View style={{
        position: "absolute",
        top: 0,
        left: 14 * s,
        width: 30 * s,
        height: 30 * s,
        backgroundColor: "#F5B942",
        borderRadius: 15 * s,
      }}>
        <View style={{ position: "absolute", top: 5 * s, left: 5 * s, width: 18 * s, height: 18 * s, borderRadius: 9 * s, backgroundColor: "#E8962A" }} />
      </View>
      <View style={{
        position: "absolute",
        top: 0,
        right: 14 * s,
        width: 30 * s,
        height: 30 * s,
        backgroundColor: "#F5B942",
        borderRadius: 15 * s,
      }}>
        <View style={{ position: "absolute", top: 5 * s, left: 5 * s, width: 18 * s, height: 18 * s, borderRadius: 9 * s, backgroundColor: "#E8962A" }} />
      </View>

      {/* Head */}
      <View style={{
        position: "absolute",
        top: 14 * s,
        width: 100 * s,
        height: 88 * s,
        backgroundColor: "#F5B942",
        borderRadius: 44 * s,
        alignItems: "center",
      }}>
        {/* Head spots */}
        <View style={{ position: "absolute", top: 10 * s, left: 20 * s, width: 9 * s, height: 9 * s, borderRadius: 4.5 * s, backgroundColor: "#C97B22" }} />
        <View style={{ position: "absolute", top: 10 * s, right: 20 * s, width: 9 * s, height: 9 * s, borderRadius: 4.5 * s, backgroundColor: "#C97B22" }} />
        <View style={{ position: "absolute", top: 6 * s, left: 42 * s, width: 7 * s, height: 7 * s, borderRadius: 3.5 * s, backgroundColor: "#C97B22" }} />

        {/* Glasses bridge */}
        <View style={{
          position: "absolute",
          top: 30 * s,
          left: "50%" as any,
          marginLeft: -6 * s,
          width: 12 * s,
          height: 5 * s,
          backgroundColor: "#2D1B0E",
          borderRadius: 2.5 * s,
        }} />

        {/* Left glasses frame */}
        <View style={{
          position: "absolute",
          top: 22 * s,
          left: 12 * s,
          width: 32 * s,
          height: 32 * s,
          borderRadius: 16 * s,
          borderWidth: 3.5 * s,
          borderColor: "#2D1B0E",
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Left eye */}
          <View style={{
            width: 18 * s,
            height: 20 * s,
            borderRadius: 10 * s,
            backgroundColor: "#2D1B0E",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <View style={{ position: "absolute", top: 3 * s, right: 3 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: "#FFF" }} />
          </View>
        </View>

        {/* Right glasses frame */}
        <View style={{
          position: "absolute",
          top: 22 * s,
          right: 12 * s,
          width: 32 * s,
          height: 32 * s,
          borderRadius: 16 * s,
          borderWidth: 3.5 * s,
          borderColor: "#2D1B0E",
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Right eye */}
          <View style={{
            width: 18 * s,
            height: 20 * s,
            borderRadius: 10 * s,
            backgroundColor: "#2D1B0E",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <View style={{ position: "absolute", top: 3 * s, right: 3 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: "#FFF" }} />
          </View>
        </View>

        {/* Muzzle */}
        <View style={{
          position: "absolute",
          bottom: 14 * s,
          width: 40 * s,
          height: 26 * s,
          backgroundColor: "#FFF5DC",
          borderRadius: 20 * s,
          alignItems: "center",
        }}>
          {/* Nose */}
          <View style={{
            position: "absolute",
            top: 3 * s,
            width: 10 * s,
            height: 7 * s,
            backgroundColor: "#2D1B0E",
            borderRadius: 5 * s,
          }} />
          {/* Smile */}
          <View style={{
            position: "absolute",
            bottom: 4 * s,
            width: 18 * s,
            height: 9 * s,
            borderBottomLeftRadius: 9 * s,
            borderBottomRightRadius: 9 * s,
            borderWidth: 2.5 * s,
            borderTopWidth: 0,
            borderColor: "#2D1B0E",
          }} />
        </View>
      </View>
    </View>
  );
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

  const s = Math.min(width, height) / 400;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <MascotShape s={s} />
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
