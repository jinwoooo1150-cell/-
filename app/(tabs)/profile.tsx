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
import { Ionicons } from "@expo/vector-icons";
import { CheetahMascot } from "@/components/CheetahMascot";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

interface ProfileMenuItemProps {
  icon: string;
  title: string;
  value?: string;
  showChevron?: boolean;
}

function ProfileMenuItem({ icon, title, value, showChevron = true }: ProfileMenuItemProps) {
  return (
    <Pressable style={({ pressed }) => [
      styles.menuItem,
      pressed && { opacity: 0.8 },
    ]}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon as any} size={22} color={Colors.light.tint} />
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color={Colors.light.textMuted} />
        )}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { streak, subCategories } = useStudy();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const completedLessons = subCategories.reduce((sum, c) => sum + c.completedLessons, 0);
  const totalLessons = subCategories.reduce((sum, c) => sum + c.totalLessons, 0);

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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <CheetahMascot size={70} />
          </View>
          <Text style={styles.userName}>수험생</Text>
          <Text style={styles.userLevel}>Level 5</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={26} color={Colors.light.tint} />
            <Text style={styles.statValue}>{streak}일</Text>
            <Text style={styles.statLabel}>연속 학습</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={26} color={Colors.light.success} />
            <Text style={styles.statValue}>{completedLessons}/{totalLessons}</Text>
            <Text style={styles.statLabel}>완료 레슨</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem icon="notifications-outline" title="알림 설정" />
            <View style={styles.menuDivider} />
            <ProfileMenuItem icon="moon-outline" title="다크 모드" value="자동" />
            <View style={styles.menuDivider} />
            <ProfileMenuItem icon="help-circle-outline" title="Su-o-lingo 사용법" />
            <View style={styles.menuDivider} />
            <ProfileMenuItem icon="information-circle-outline" title="앱 정보" value="v1.0.0" />
          </View>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  userName: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 24,
    color: Colors.light.text,
  },
  userLevel: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: Colors.light.tint,
    backgroundColor: Colors.light.cream,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: "NotoSansKR_900Black",
    fontSize: 18,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: "center",
  },
  menuSection: {
    gap: 14,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: Colors.light.text,
  },
  menuCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuTitle: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 15,
    color: Colors.light.text,
  },
  menuValue: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 50,
  },
});
