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
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

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
          <View style={styles.motivationCard}>
            <Text style={styles.motivationEyebrow}>오늘의 한마디</Text>
            <Text style={styles.motivationTitle}>꾸준함이 결국 실력을 만듭니다.</Text>
            <Text style={styles.motivationBody}>
              하루 10분이라도 좋으니, 오늘의 공부를 끝까지 이어 가 보세요.
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem icon="notifications-outline" title="알림 설정" />
            <View style={styles.menuDivider} />
            <ProfileMenuItem icon="moon-outline" title="다크 모드" value="자동" />
            <View style={styles.menuDivider} />
            <ProfileMenuItem icon="help-circle-outline" title="Suo 사용법" />
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
    gap: 14,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  motivationCard: {
    width: "100%",
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  motivationEyebrow: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 12,
    color: Colors.light.tint,
  },
  motivationTitle: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 22,
    lineHeight: 30,
    color: Colors.light.text,
  },
  motivationBody: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    lineHeight: 21,
    color: Colors.light.textMuted,
  },
  menuSection: {
    gap: 14,
  },
  sectionTitle: {
    fontFamily: "NotoSansKR_500Medium",
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
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 50,
  },
});
