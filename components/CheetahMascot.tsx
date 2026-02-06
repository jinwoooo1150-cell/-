import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

interface CheetahMascotProps {
  size?: number;
}

export function CheetahMascot({ size = 100 }: CheetahMascotProps) {
  const breathScale = useSharedValue(1);
  const blinkHeight = useSharedValue(1);

  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const startBlinking = () => {
      blinkHeight.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2800 }),
          withTiming(0.1, { duration: 100 }),
          withTiming(1, { duration: 100 }),
          withTiming(1, { duration: 800 }),
          withTiming(0.1, { duration: 100 }),
          withTiming(1, { duration: 100 })
        ),
        -1,
        false
      );
    };
    startBlinking();
  }, []);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const blinkStyleLeft = useAnimatedStyle(() => ({
    transform: [{ scaleY: blinkHeight.value }],
  }));

  const blinkStyleRight = useAnimatedStyle(() => ({
    transform: [{ scaleY: blinkHeight.value }],
  }));

  const s = size / 100;

  return (
    <Animated.View style={[styles.container, { width: size * 1.2, height: size * 1.2 }, breathStyle]}>
      <View style={[styles.earLeft, { 
        top: 8 * s, left: 10 * s, width: 30 * s, height: 30 * s, borderRadius: 15 * s 
      }]} />
      <View style={[styles.earRight, { 
        top: 8 * s, right: 10 * s, width: 30 * s, height: 30 * s, borderRadius: 15 * s 
      }]} />
      <View style={[styles.earInnerLeft, { 
        top: 12 * s, left: 16 * s, width: 18 * s, height: 18 * s, borderRadius: 9 * s 
      }]} />
      <View style={[styles.earInnerRight, { 
        top: 12 * s, right: 16 * s, width: 18 * s, height: 18 * s, borderRadius: 9 * s 
      }]} />
      <View style={[styles.head, { 
        width: size, height: 90 * s, borderRadius: 45 * s, 
        top: 15 * s, left: 10 * s 
      }]}>
        <Animated.View style={[styles.eyeContainer, {
          top: 25 * s, left: 18 * s, width: 24 * s, height: 26 * s, borderRadius: 13 * s,
        }, blinkStyleLeft]}>
          <View style={[styles.eyeWhite, {
            width: 22 * s, height: 24 * s, borderRadius: 12 * s,
          }]}>
            <View style={[styles.pupil, {
              width: 12 * s, height: 14 * s, borderRadius: 7 * s,
            }]}>
              <View style={[styles.pupilHighlight, {
                width: 4 * s, height: 4 * s, borderRadius: 2 * s,
                top: 2 * s, right: 2 * s,
              }]} />
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.eyeContainer, {
          top: 25 * s, right: 18 * s, width: 24 * s, height: 26 * s, borderRadius: 13 * s,
        }, blinkStyleRight]}>
          <View style={[styles.eyeWhite, {
            width: 22 * s, height: 24 * s, borderRadius: 12 * s,
          }]}>
            <View style={[styles.pupil, {
              width: 12 * s, height: 14 * s, borderRadius: 7 * s,
            }]}>
              <View style={[styles.pupilHighlight, {
                width: 4 * s, height: 4 * s, borderRadius: 2 * s,
                top: 2 * s, right: 2 * s,
              }]} />
            </View>
          </View>
        </Animated.View>
        <View style={[styles.nose, {
          top: 52 * s, width: 14 * s, height: 10 * s, borderRadius: 7 * s,
        }]} />
        <View style={[styles.mouth, {
          top: 60 * s, width: 24 * s, height: 12 * s,
          borderBottomLeftRadius: 12 * s, borderBottomRightRadius: 12 * s,
          borderWidth: 2.5 * s,
        }]} />
        <View style={[styles.cheekLeft, {
          top: 48 * s, left: 8 * s, width: 14 * s, height: 8 * s, borderRadius: 4 * s,
        }]} />
        <View style={[styles.cheekRight, {
          top: 48 * s, right: 8 * s, width: 14 * s, height: 8 * s, borderRadius: 4 * s,
        }]} />
        <View style={[styles.spot, {
          top: 12 * s, left: 22 * s, width: 7 * s, height: 7 * s, borderRadius: 3.5 * s,
        }]} />
        <View style={[styles.spot, {
          top: 12 * s, right: 22 * s, width: 7 * s, height: 7 * s, borderRadius: 3.5 * s,
        }]} />
        <View style={[styles.spot, {
          top: 8 * s, left: 38 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s,
        }]} />
        <View style={[styles.spot, {
          top: 20 * s, left: 12 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s,
        }]} />
        <View style={[styles.spot, {
          top: 20 * s, right: 12 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s,
        }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  head: {
    backgroundColor: "#FFF",
    position: "absolute",
    alignItems: "center",
  },
  earLeft: {
    position: "absolute",
    backgroundColor: Colors.light.tint,
    transform: [{ rotate: "-15deg" }],
    zIndex: -1,
  },
  earRight: {
    position: "absolute",
    backgroundColor: Colors.light.tint,
    transform: [{ rotate: "15deg" }],
    zIndex: -1,
  },
  earInnerLeft: {
    position: "absolute",
    backgroundColor: Colors.light.tintLight,
    transform: [{ rotate: "-15deg" }],
    zIndex: -1,
  },
  earInnerRight: {
    position: "absolute",
    backgroundColor: Colors.light.tintLight,
    transform: [{ rotate: "15deg" }],
    zIndex: -1,
  },
  eyeContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  eyeWhite: {
    backgroundColor: "#FFF",
    borderWidth: 2.5,
    borderColor: "#2D1B0E",
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    backgroundColor: "#2D1B0E",
    marginTop: 2,
    position: "relative",
  },
  pupilHighlight: {
    position: "absolute",
    backgroundColor: "#FFF",
  },
  nose: {
    position: "absolute",
    backgroundColor: "#2D1B0E",
  },
  mouth: {
    position: "absolute",
    borderTopWidth: 0,
    borderColor: "#2D1B0E",
    backgroundColor: "transparent",
  },
  cheekLeft: {
    position: "absolute",
    backgroundColor: Colors.light.tintGlow,
    opacity: 0.4,
  },
  cheekRight: {
    position: "absolute",
    backgroundColor: Colors.light.tintGlow,
    opacity: 0.4,
  },
  spot: {
    position: "absolute",
    backgroundColor: Colors.light.tintLight,
    opacity: 0.6,
  },
});
