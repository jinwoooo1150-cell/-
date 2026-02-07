import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { SubCategoryCard } from "@/components/SubCategoryCard";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

export default function LiteratureScreen() {
  const insets = useSafeAreaInsets();
  const { subCategories } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleCategoryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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
        <Text style={styles.headerTitle}>문학</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.content, {
        paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
      }]}>
        <View style={styles.grid}>
          {subCategories.map((cat, index) => (
            <Animated.View
              key={cat.id}
              entering={Platform.OS !== "web" ? FadeInDown.delay(index * 100).springify() : undefined}
              style={styles.gridItem}
            >
              <SubCategoryCard
                name={cat.name}
                icon={cat.icon}
                unlocked={cat.unlocked}
                progress={cat.progress}
                completedLessons={cat.completedLessons}
                totalLessons={cat.totalLessons}
                onPress={handleCategoryPress}
              />
            </Animated.View>
          ))}
        </View>
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  gridItem: {
    width: "46%",
  },
});
