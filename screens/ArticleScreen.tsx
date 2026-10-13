import React from "react";
import { Text, TouchableOpacity, View, ScrollView, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Article, Typography } from "@fundacja-peryskop/ui";
import { getArticleByIdQueryOptions } from "@/modules/articles/queries/getArticleByIdQueryOptions";
import Loader from "@/modules/shared/components/Loader";
import { useTranslation } from "react-i18next";
import Markdown, {
    MarkdownStyleMap,
} from "@ronradtke/react-native-markdown-display";
import { Article as ArticleType } from "@/modules/articles/types";

const markdownStyles: MarkdownStyleMap = {
    body: { color: "#334155", fontSize: 16, lineHeight: 24 },
    strong: { fontWeight: "bold", color: "#0f172a" },
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
    link: { color: "#00c4a7", textDecorationLine: "underline" },
    bullet_list: { marginTop: 8, marginBottom: 8 },
    ordered_list: { marginTop: 8, marginBottom: 8 },
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

const ArticleView = ({
    article,
    onBackPress,
}: {
    article: ArticleType;
    onBackPress: () => void;
}) => {
    const { t } = useTranslation();
    const [bannerFailed, setBannerFailed] = React.useState(false);

    React.useEffect(() => {
        setBannerFailed(false);
    }, [article.banner_url]);

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
        >
            <Article className="bg-white">
                {onBackPress && (
                    <View className="px-4 py-3 border-b border-slate-100 flex-row items-center">
                        <TouchableOpacity
                            onPress={onBackPress}
                            className="py-1 pr-4"
                        >
                            <Typography
                                variant="regularSemibold"
                                className="text-[#142333]"
                            >
                                {t("common_return")}
                            </Typography>
                        </TouchableOpacity>
                    </View>
                )}
                <Article.Banner className="h-64 bg-slate-200">
                    {article.banner_url ? (
                        <Image
                            source={{ uri: article.banner_url }}
                            className="w-full h-full"
                            resizeMode="cover"
                            onError={() => setBannerFailed(true)}
                        />
                    ) : null}
                    {(!article.banner_url || bannerFailed) && (
                        <View className="w-full h-full items-center justify-center">
                            <Typography
                                variant="smallRegular"
                                className="text-slate-500"
                            >
                                {t("articles.banner_unavailable", {
                                    defaultValue: "Brak banera",
                                })}
                            </Typography>
                        </View>
                    )}
                </Article.Banner>
                <Article.Content className="p-5 gap-4">
                    <View className="bg-[#00c4a7] px-2.5 py-1 rounded self-start">
                        <Typography
                            variant="smallSemibold"
                            className="text-white uppercase tracking-wider"
                        >
                            {article.article_category.name}
                        </Typography>
                    </View>

                    <Typography variant="title2" className="text-[#142333]">
                        {article.title}
                    </Typography>

                    {(article.created_by || article.creation_date) && (
                        <View className="flex-row items-center border-b border-slate-150 pb-4 gap-2">
                            {article.created_by && (
                                <Typography
                                    variant="smallRegular"
                                    className="text-slate-800"
                                >
                                    {article.created_by?.full_name}
                                </Typography>
                            )}
                            {article.created_by && article.creation_date && (
                                <Typography
                                    variant="smallRegular"
                                    className="text-slate-300"
                                >
                                    •
                                </Typography>
                            )}
                            {article.creation_date && (
                                <Typography
                                    variant="smallRegular"
                                    className="text-slate-500"
                                >
                                    {article.creation_date}
                                </Typography>
                            )}
                        </View>
                    )}

                    <Markdown style={markdownStyles}>
                        {article.content}
                    </Markdown>
                </Article.Content>
            </Article>
        </ScrollView>
    );
};

const ArticleScreen = () => {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const articleId = Number(id) || -1;

    const { data: article, isLoading: isArticleLoading } = useQuery(
        getArticleByIdQueryOptions({ id: articleId }, {}),
    );

    if (isArticleLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Loader variant={"small"} />
            </View>
        );
    }

    if (!article) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-4">
                <Text className="text-slate-500 text-base">
                    {t("errors.article_not_found")}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ArticleView article={article} onBackPress={() => router.back()} />
        </View>
    );
};

export default ArticleScreen;
