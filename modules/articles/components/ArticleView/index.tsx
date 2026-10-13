import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Article } from "@/modules/articles/types";
import Markdown, {
    MarkdownStyleMap,
} from "@ronradtke/react-native-markdown-display";
import { useTranslation } from "react-i18next";

type Props = {
    article: Article;
    onBackPress: () => void;
};
const ArticleView = ({ article, onBackPress }: Props) => {
    const { t } = useTranslation();
    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
        >
            {onBackPress && (
                <View className="px-4 py-3 border-b border-slate-100 flex-row items-center">
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="py-1 pr-4"
                    >
                        <Text className="text-[#142333] font-semibold text-base">
                            {t("common_return")}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            {article.banner_url && (
                <Image
                    source={{ uri: article.banner_url }}
                    className="w-full h-64 bg-slate-200"
                    resizeMode="cover"
                />
            )}

            <View className="p-5">
                <View className="bg-[#00c4a7] px-2.5 py-1 rounded self-start mb-3">
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">
                        {article.article_category.name}
                    </Text>
                </View>

                <Text className="text-[28px] leading-9 font-bold text-[#142333] mb-3">
                    {article.title}
                </Text>

                {(article.created_by || article.creation_date) && (
                    <View className="flex-row items-center mb-6 border-b border-slate-150 pb-4">
                        {article.created_by && (
                            <Text className="text-sm font-medium text-slate-800 mr-3">
                                {article.created_by?.full_name}
                            </Text>
                        )}
                        {article.created_by && article.creation_date && (
                            <Text className="text-slate-300">•</Text>
                        )}
                        {article.creation_date && (
                            <Text className="text-sm text-slate-500 ml-3">
                                {article.creation_date}
                            </Text>
                        )}
                    </View>
                )}

                <Markdown style={markdownStyles}>{article.content}</Markdown>
            </View>
        </ScrollView>
    );
};
export default ArticleView;

const markdownStyles: MarkdownStyleMap = {
    body: {
        color: "#334155",
        fontSize: 16,
        lineHeight: 24,
    },
    strong: {
        fontWeight: "bold",
        color: "#0f172a",
    },
    heading1: {
        color: "#142333",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        lineHeight: 30,
    },
    heading2: {
        color: "#142333",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
        lineHeight: 26,
    },
    heading3: {
        color: "#142333",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 14,
        marginBottom: 6,
    },
    link: {
        color: "#00c4a7",
        textDecorationLine: "underline",
    },
    // Listy
    bullet_list: {
        marginTop: 8,
        marginBottom: 8,
    },
    ordered_list: {
        marginTop: 8,
        marginBottom: 8,
    },
    blockquote: {
        backgroundColor: "#f8fafc",
        borderLeftColor: "#00c4a7",
        borderLeftWidth: 4,
        paddingLeft: 12,
        paddingVertical: 6,
        marginVertical: 10,
    },
    code_inline: {
        backgroundColor: "#f1f5f9",
        color: "#b91c1c",
        paddingHorizontal: 4,
        borderRadius: 4,
        fontFamily: "Platform-specific-monospace",
    },
};
