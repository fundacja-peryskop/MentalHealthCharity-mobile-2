import AppBackground from "@/modules/shared/components/App-Background";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Avatar, Button, Article, Typography } from "@fundacja-peryskop/ui";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ArticleStatus } from "@/modules/articles/constants";
import { articlesQueryOptions } from "@/modules/articles/queries/articlesQueryOptions";
import { Article as ArticleType } from "@/modules/articles/types";

const ArticleCard = ({ article }: { article: ArticleType }) => (
    <Article className="w-full bg-[#f4f5f7] rounded-xl overflow-hidden">
        <Article.Banner className="h-40 bg-slate-300">
            {article.banner_url ? (
                <Image
                    source={{ uri: article.banner_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={({ nativeEvent }) =>
                        console.warn(
                            `Failed to load article banner: ${article.banner_url}`,
                            nativeEvent?.error,
                        )
                    }
                />
            ) : null}
        </Article.Banner>
        <Article.Content className="p-4 pt-3 gap-2">
            <View className="bg-[#00c4a7] px-2 py-1 rounded self-start">
                <Typography variant="smallSemibold" className="text-white">
                    {article.article_category.name}
                </Typography>
            </View>

            <Typography
                variant="title3"
                className="text-[#142333]"
                numberOfLines={2}
            >
                {article.title}
            </Typography>

            <Typography
                variant="regularRegular"
                className="text-slate-700"
                numberOfLines={2}
            >
                {article.content}
            </Typography>
        </Article.Content>
    </Article>
);

const MainScreen = () => {
    const { user } = useUser();
    const { t } = useTranslation();

    const { data, isLoading } = useQuery(
        articlesQueryOptions({
            q: "",
            page: 1,
            size: 50,
            status: ArticleStatus.PUBLISHED,
        }),
    );

    const articles = useMemo(() => {
        if (!data?.items) return [];

        return data.items
            .filter((article) => article.status === ArticleStatus.PUBLISHED)
            .sort(
                (a, b) =>
                    new Date(b.creation_date).getTime() -
                    new Date(a.creation_date).getTime(),
            );
    }, [data]);

    const hasAssignedChat = Boolean(user?.is_assigned_to_chat);

    return (
        <AppBackground>
            <View className="px-4 pb-3 pt-4">
                <View className="gap-4 rounded-lg bg-white/95 p-4">
                    <View className="gap-1 flex-row items-center">
                        <Avatar name={user?.full_name} size={48} />
                        <View className="gap-1 ml-3">
                            <Text className="text-sm font-medium text-slate-500">
                                {t("common.login_screen.header")}
                            </Text>
                            <Text
                                className="text-2xl font-bold leading-8 text-slate-900"
                                numberOfLines={2}
                            >
                                {user?.full_name}
                            </Text>
                        </View>
                    </View>

                    <Button
                        variant={hasAssignedChat ? "primary" : "secondary"}
                        fullWidth
                        disabled={!hasAssignedChat}
                        onPress={() => router.push("/chats")}
                    >
                        {t(
                            hasAssignedChat
                                ? "user.chat_with.volunteer"
                                : "user.wait_for_chat",
                        )}
                    </Button>
                </View>
            </View>

            <FlatList
                data={articles}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 6,
                    paddingBottom: 36,
                }}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListEmptyComponent={
                    <View className="items-center py-8">
                        {isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <Text className="text-center text-base text-slate-600">
                                {t("articles.empty", {
                                    defaultValue: "Brak artykułów",
                                })}
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                            router.push({
                                pathname: "/articles/[id]",
                                params: {
                                    id: String(item.id),
                                },
                            });
                        }}
                    >
                        <ArticleCard article={item} />
                    </TouchableOpacity>
                )}
            />
        </AppBackground>
    );
};

export default MainScreen;
