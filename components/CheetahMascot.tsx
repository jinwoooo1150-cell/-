import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
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
      top: -40 * s,
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
  const blinkHeight = useSharedValue(1);
  const bounceY = useSharedValue(0);

  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
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

  useEffect(() => {
    if (mood === "happy") {
      bounceY.value = withSequence(
        withTiming(-8, { duration: 200 }),
        withSpring(0, { damping: 6, stiffness: 200 })
      );
    } else if (mood === "sad") {
      bounceY.value = withTiming(4, { duration: 400 });
    } else {
      bounceY.value = withTiming(0, { duration: 300 });
    }
  }, [mood]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }, { translateY: bounceY.value }],
  }));

  const blinkStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: blinkHeight.value }],
  }));

  const s = size / 100;

  const getMouthStyle = () => {
    if (mood === "happy") {
      return {
        width: 28 * s,
        height: 14 * s,
        borderBottomLeftRadius: 14 * s,
        borderBottomRightRadius: 14 * s,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderWidth: 2.5 * s,
        borderTopWidth: 0,
        borderColor: "#2D1B0E",
        backgroundColor: "#FF6B6B",
      };
    }
    if (mood === "sad") {
      return {
        width: 20 * s,
        height: 10 * s,
        borderTopLeftRadius: 10 * s,
        borderTopRightRadius: 10 * s,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderWidth: 2.5 * s,
        borderBottomWidth: 0,
        borderColor: "#2D1B0E",
        backgroundColor: "transparent",
      };
    }
    if (mood === "thinking") {
      return {
        width: 12 * s,
        height: 12 * s,
        borderRadius: 6 * s,
        borderWidth: 2.5 * s,
        borderColor: "#2D1B0E",
        backgroundColor: "transparent",
      };
    }
    return {
      width: 24 * s,
      height: 12 * s,
      borderBottomLeftRadius: 12 * s,
      borderBottomRightRadius: 12 * s,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderWidth: 2.5 * s,
      borderTopWidth: 0,
      borderColor: "#2D1B0E",
      backgroundColor: "transparent",
    };
  };

  const getEyeExtra = () => {
    if (mood === "happy") {
      return { height: 16 * s };
    }
    if (mood === "sad") {
      return { height: 28 * s };
    }
    return { height: 26 * s };
  };

  return (
    <View style={{ alignItems: "center" }}>
      {speechBubble && <SpeechBubble text={speechBubble} size={size} />}
      <Animated.View style={[{ width: size * 1.2, height: size * 1.2, alignItems: "center", justifyContent: "center", position: "relative" }, breathStyle]}>
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
            top: 25 * s, left: 18 * s, width: 24 * s, ...getEyeExtra(), borderRadius: 13 * s,
          }, blinkStyle]}>
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
            top: 25 * s, right: 18 * s, width: 24 * s, ...getEyeExtra(), borderRadius: 13 * s,
          }, blinkStyle]}>
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
          <View style={[{
            position: "absolute",
            top: mood === "sad" ? 62 * s : 60 * s,
            alignSelf: "center",
          }, getMouthStyle()]} />

          {mood === "happy" && (
            <>
              <View style={[styles.blush, {
                top: 45 * s, left: 4 * s, width: 16 * s, height: 10 * s, borderRadius: 5 * s,
              }]} />
              <View style={[styles.blush, {
                top: 45 * s, right: 4 * s, width: 16 * s, height: 10 * s, borderRadius: 5 * s,
              }]} />
            </>
          )}

          {mood === "thinking" && (
            <>
              <View style={{
                position: "absolute",
                top: 10 * s,
                right: -2 * s,
                width: 6 * s,
                height: 6 * s,
                borderRadius: 3 * s,
                backgroundColor: Colors.light.tintLight,
              }} />
              <View style={{
                position: "absolute",
                top: 4 * s,
                right: 6 * s,
                width: 4 * s,
                height: 4 * s,
                borderRadius: 2 * s,
                backgroundColor: Colors.light.tintLight,
              }} />
            </>
          )}

          {mood === "sad" && (
            <>
              <View style={{
                position: "absolute",
                top: 46 * s,
                left: 20 * s,
                width: 3 * s,
                height: 8 * s,
                borderRadius: 1.5 * s,
                backgroundColor: "#87CEEB",
                opacity: 0.7,
              }} />
              <View style={{
                position: "absolute",
                top: 46 * s,
                right: 20 * s,
                width: 3 * s,
                height: 8 * s,
                borderRadius: 1.5 * s,
                backgroundColor: "#87CEEB",
                opacity: 0.7,
              }} />
            </>
          )}

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
    </View>
  );
}

const styles = StyleSheet.create({
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
  head: {
    backgroundColor: "#FFF",
    position: "absolute",
    alignItems: "center",
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
  cheekLeft: {
    position: "absolute",
    backgroundColor: Colors.light.tintGlow,
    opacity: 0.3,
  },
  cheekRight: {
    position: "absolute",
    backgroundColor: Colors.light.tintGlow,
    opacity: 0.3,
  },
  blush: {
    position: "absolute",
    backgroundColor: "#FFBABA",
    opacity: 0.5,
  },
  spot: {
    position: "absolute",
    backgroundColor: Colors.light.tintLight,
    opacity: 0.5,
  },
});
