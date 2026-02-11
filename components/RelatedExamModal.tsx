// components/RelatedExamModal.tsx

import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    RelatedExamQuestion,
    QuizPassage,
    NarrativeSection,
    CharacterMapData,
} from "@/data/quizData";
import Colors from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 부모 컴포넌트로부터 quiz 데이터를 통째로 받거나 필요한 모든 props를 전달받아야 합니다.
// 여기서는 QuizPassage 전체를 받는 것으로 정의합니다.
interface RelatedExamModalProps {
    visible: boolean;
    onClose: () => void;
    questions: RelatedExamQuestion[];
    quizId: string;
    parentQuizData: QuizPassage; // 메인 퀴즈 데이터 전달받음
}

// ... (간단한 모달 컴포넌트들은 상위 파일에서 export하거나 여기서 재정의)
// 편의상 여기서도 간략한 모달 뷰 로직이 필요하다면 상위 컴포넌트의 state를 제어하는 방식이 좋으나,
// 모달 위에 모달을 띄우는 것은 UX상 복잡하므로, 여기서는 "탭"을 누르면 해당 내용을 보여주는
// "서브 뷰"를 모달 내부에 띄우거나 토글하는 방식으로 구현합니다.

export function RelatedExamModal({
    visible,
    onClose,
    questions,
    parentQuizData,
}: RelatedExamModalProps) {
    const insets = useSafeAreaInsets();

    // 내부 탭 상태
    const [activeTabContent, setActiveTabContent] = useState<
        "none" | "desc" | "map" | "plot" | "fulltext"
    >("none");

    const isModernPoetry = parentQuizData.categoryId === "modern-poem";
    const isNovel =
        parentQuizData.categoryId === "modern-novel" ||
        parentQuizData.categoryId === "classic-novel";
    const isClassicPoetry = parentQuizData.categoryId === "classic-poetry";

    // 탭 렌더링
    const renderHeaderTabs = () => (
        <View style={styles.tabRow}>
            {/* 현대시/고전시가: 작품 설명 */}
            {(isModernPoetry || isClassicPoetry) &&
                parentQuizData.description && (
                    <Pressable
                        onPress={() => setActiveTabContent("desc")}
                        style={[
                            styles.tabBtn,
                            activeTabContent === "desc" && styles.tabBtnActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabBtnText,
                                activeTabContent === "desc" &&
                                    styles.tabBtnTextActive,
                            ]}
                        >
                            작품 설명
                        </Text>
                    </Pressable>
                )}
            {/* 소설: 인물 관계도 */}
            {isNovel && parentQuizData.characterMap && (
                <Pressable
                    onPress={() => setActiveTabContent("map")}
                    style={[
                        styles.tabBtn,
                        activeTabContent === "map" && styles.tabBtnActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.tabBtnText,
                            activeTabContent === "map" &&
                                styles.tabBtnTextActive,
                        ]}
                    >
                        인물 관계도
                    </Text>
                </Pressable>
            )}
            {/* 소설: 전체 줄거리 */}
            {isNovel && parentQuizData.narrativeSections && (
                <Pressable
                    onPress={() => setActiveTabContent("plot")}
                    style={[
                        styles.tabBtn,
                        activeTabContent === "plot" && styles.tabBtnActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.tabBtnText,
                            activeTabContent === "plot" &&
                                styles.tabBtnTextActive,
                        ]}
                    >
                        전체 줄거리
                    </Text>
                </Pressable>
            )}
            {/* 모든 갈래(현대시 제외): 수특 전문 (현대시는 기본이 전문이므로 제외하거나 포함 가능, 요구사항 11번은 전문 수록이라 했으므로 이미 표시됨) */}
            {/* 요구사항 12, 13, 14에 따라 수특 전문 탭 추가 */}
            {!isModernPoetry && (
                <Pressable
                    onPress={() => setActiveTabContent("fulltext")}
                    style={[
                        styles.tabBtn,
                        activeTabContent === "fulltext" && styles.tabBtnActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.tabBtnText,
                            activeTabContent === "fulltext" &&
                                styles.tabBtnTextActive,
                        ]}
                    >
                        수특 전문
                    </Text>
                </Pressable>
            )}
        </View>
    );

    // 탭 내용 렌더링
    const renderTabContent = () => {
        if (activeTabContent === "none") return null;

        let content = null;
        if (activeTabContent === "desc")
            content = (
                <Text style={styles.contentText}>
                    {parentQuizData.description}
                </Text>
            );
        if (activeTabContent === "fulltext")
            content = (
                <Text style={styles.contentText}>{parentQuizData.passage}</Text>
            );
        if (activeTabContent === "plot") {
            content = (
                <View>
                    {parentQuizData.narrativeSections?.map((s, i) => (
                        <View key={i} style={styles.plotItem}>
                            <Text style={styles.plotHeader}>
                                {s.phase} : {s.title}
                            </Text>
                            <Text>{s.summary}</Text>
                        </View>
                    ))}
                </View>
            );
        }
        if (activeTabContent === "map") {
            content = <Text>인물 관계도 데이터 렌더링...</Text>; // 실제 구현 시 CharacterMap 컴포넌트 재사용
        }

        return (
            <View style={styles.contentPanel}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        참고 자료
                    </Text>
                    <Pressable onPress={() => setActiveTabContent("none")}>
                        <Ionicons name="close" size={20} />
                    </Pressable>
                </View>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {content}
                </ScrollView>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View
                style={[
                    styles.container,
                    {
                        paddingTop:
                            Platform.OS === "android" ? insets.top + 16 : 16,
                    },
                ]}
            >
                <View style={styles.header}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Ionicons name="school" size={24} color="#8B5CF6" />
                        <Text style={styles.headerTitle}>연관 기출 학습</Text>
                    </View>
                    <Pressable onPress={onClose}>
                        <Ionicons name="close" size={28} />
                    </Pressable>
                </View>

                {/* 심층 학습 탭 */}
                {renderHeaderTabs()}
                {renderTabContent()}

                <ScrollView contentContainerStyle={styles.listContent}>
                    {questions.map((q, i) => (
                        <View key={q.id} style={styles.examCard}>
                            <View style={styles.examMeta}>
                                <Text style={styles.sourceBadge}>
                                    {q.sourceTitle}
                                </Text>
                            </View>

                            {/* 현대시는 전문이 이미 위에서 제공되거나 함, 다른 갈래는 발췌문 표시 */}
                            {/* 요구사항: 현대시 기출은 전문 수록(이건 데이터에 따라 다름), 그 외는 발췌문 표시 */}
                            {isModernPoetry ? (
                                <View style={styles.excerptBox}>
                                    <Text style={styles.excerptText}>
                                        {parentQuizData.passage}
                                    </Text>
                                </View>
                            ) : (
                                q.relatedExcerpt && (
                                    <View style={styles.excerptBox}>
                                        <Text style={styles.excerptLabel}>
                                            관련 부분
                                        </Text>
                                        <Text style={styles.excerptText}>
                                            {q.relatedExcerpt}
                                        </Text>
                                    </View>
                                )
                            )}

                            <Text style={styles.statement}>{q.statement}</Text>

                            {/* O/X 버튼 및 정답 확인 로직 (간소화) */}
                            <View style={styles.oxRow}>
                                <Pressable style={styles.oxBtnSmall}>
                                    <Text>O</Text>
                                </Pressable>
                                <Pressable style={styles.oxBtnSmall}>
                                    <Text>X</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9F9" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: "#EEE",
    },
    headerTitle: { fontSize: 18, fontWeight: "bold" },

    tabRow: { flexDirection: "row", padding: 12, gap: 8, flexWrap: "wrap" },
    tabBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#EEE",
    },
    tabBtnActive: { backgroundColor: "#8B5CF6" },
    tabBtnText: { fontSize: 13, color: "#555" },
    tabBtnTextActive: { color: "#FFF", fontWeight: "bold" },

    contentPanel: {
        margin: 12,
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 12,
        elevation: 2,
    },
    contentText: { lineHeight: 22 },
    plotItem: { marginBottom: 10 },
    plotHeader: { fontWeight: "bold", fontSize: 14, color: "#8B5CF6" },

    listContent: { padding: 16, gap: 16 },
    examCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
    },
    examMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    sourceBadge: {
        fontSize: 12,
        color: "#8B5CF6",
        fontWeight: "bold",
        backgroundColor: "#F3EEFF",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },

    excerptBox: {
        backgroundColor: "#F5F5F5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    excerptLabel: {
        fontSize: 11,
        color: "#888",
        marginBottom: 4,
        fontWeight: "bold",
    },
    excerptText: { fontSize: 14, color: "#333", lineHeight: 20 },

    statement: { fontSize: 16, fontWeight: "500", marginBottom: 16 },
    oxRow: { flexDirection: "row", gap: 10 },
    oxBtnSmall: {
        flex: 1,
        height: 40,
        backgroundColor: "#EEE",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
});
