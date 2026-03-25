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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { CheetahMascot } from "@/components/CheetahMascot";
import { ThemeMode, useStudy } from "@/contexts/StudyContext";
import { getThemeLabel, useAppTheme } from "@/hooks/useAppTheme";

interface ProfileMenuItemProps {
  icon: string;
  title: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

function ProfileMenuItem({ icon, title, value, showChevron = true, onPress }: ProfileMenuItemProps) {
  const theme = useAppTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.8 }]}> 
      <View style={styles.menuLeft}>
        <Ionicons name={icon as any} size={22} color={theme.tint} />
        <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={[styles.menuValue, { color: theme.textMuted }]}>{value}</Text>}
        {showChevron && <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useStudy();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;
  const nextThemeMode: ThemeMode = themeMode === "system" ? "light" : themeMode === "light" ? "dark" : "system";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
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
          <View style={[styles.motivationCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.motivationEyebrow, { color: theme.tint }]}>오늘의 한마디</Text>
            <Text style={[styles.motivationTitle, { color: theme.text }]}>꾸준함이 결국 실력을 만듭니다.</Text>
            <Text style={[styles.motivationBody, { color: theme.textMuted }]}>하루 10분이라도 좋으니, 오늘의 공부를 끝까지 이어 가 보세요.</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>설정</Text>
          <View style={[styles.menuCard, { backgroundColor: theme.card }]}> 
            <ProfileMenuItem icon="notifications-outline" title="알림 설정" />
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            <ProfileMenuItem
              icon="moon-outline"
              title="다크 모드"
              value={getThemeLabel(themeMode)}
              onPress={() => setThemeMode(nextThemeMode)}
            />
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            <ProfileMenuItem
              icon="help-circle-outline"
              title="Suo 사용법"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/guide" as any);
              }}
            />
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            <ProfileMenuItem icon="information-circle-outline" title="앱 정보" value="v1.0.0" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  profileHeader: { alignItems: "center", marginBottom: 24, gap: 14 },
  avatarContainer: { marginBottom: 8 },
  motivationCard: {
    width: "100%", borderRadius: 20, paddingHorizontal: 18, paddingVertical: 18, gap: 8, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  motivationEyebrow: { fontFamily: "NotoSansKR_500Medium", fontSize: 12 },
  motivationTitle: { fontFamily: "NotoSansKR_700Bold", fontSize: 22, lineHeight: 30 },
  motivationBody: { fontFamily: "NotoSansKR_500Medium", fontSize: 14, lineHeight: 21 },
  menuSection: { gap: 14 },
  sectionTitle: { fontFamily: "NotoSansKR_500Medium", fontSize: 18 },
  menuCard: { borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuTitle: { fontFamily: "NotoSansKR_500Medium", fontSize: 15 },
  menuValue: { fontFamily: "NotoSansKR_500Medium", fontSize: 13 },
  menuDivider: { height: 1, marginLeft: 50 },
});
