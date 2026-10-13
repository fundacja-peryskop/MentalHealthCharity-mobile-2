import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Avatar, Button, Article, Typography } from "@fundacja-peryskop/ui";
import { articlesByUserQueryOptions } from "@/modules/articles/queries/articleByUserQueryOptions";
import AppBackground from "@/modules/shared/components/App-Background";
import { useToast } from "@/modules/shared/components/Toast";
import getPublicProfileQuery from "@/modules/users/queries/getPublicProfileQuery";
import updateAvatarMutation from "@/modules/users/queries/updateAvatarMutation";
import updatePublicProfileMutation from "@/modules/users/queries/updatePublicProfileMutation";
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

            <Typography variant="title3" className="text-[#142333]" numberOfLines={2}>
                {article.title}
            </Typography>

            <Typography variant="regularRegular" className="text-slate-700" numberOfLines={2}>
                {article.content}
            </Typography>
        </Article.Content>
    </Article>
);

const SettingsScreen = () => {
    const { user, logout } = useUser();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const userId = user?.id;

    const { data: publicProfile } = useQuery({
        queryKey: ["publicProfile", userId],
        queryFn: () => getPublicProfileQuery(userId!),
        enabled: Boolean(userId),
    });

    const [description, setDescription] = useState("");

    useEffect(() => {
        if (publicProfile) {
            setDescription(publicProfile.description ?? "");
        }
    }, [publicProfile]);

    const invalidateProfile = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["publicProfile", userId] });
    }, [queryClient, userId]);

    const saveProfileMutation = useMutation({
        mutationFn: updatePublicProfileMutation,
        onSuccess: () => {
            invalidateProfile();
            showToast({ type: "success", title: t("settings.saved") });
        },
        onError: () => {
            showToast({ type: "error", title: t("settings.save_error") });
        },
    });

    const avatarMutation = useMutation({
        mutationFn: updateAvatarMutation,
        onSuccess: () => {
            invalidateProfile();
            showToast({ type: "success", title: t("settings.photo_saved") });
        },
        onError: () => {
            showToast({ type: "error", title: t("settings.photo_error") });
        },
    });

    const { data: userArticles, isLoading: isArticlesLoading } = useQuery({
        ...articlesByUserQueryOptions({ author: userId! }),
        enabled: Boolean(userId),
    });

    const handleSaveProfile = () => {
        if (!userId) return;

        saveProfileMutation.mutate({
            user_id: userId,
            avatar_url: publicProfile?.avatar_url ?? "",
            description,
        });
    };

    const handlePickImage = async () => {
        if (!userId) return;

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            showToast({ type: "warning", title: t("settings.permission_denied") });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets?.[0]) return;

        const asset = result.assets[0];
        avatarMutation.mutate({
            user_id: userId,
            avatar: {
                uri: asset.uri,
                name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
                type: asset.mimeType ?? "image/jpeg",
            },
        });
    };

    const avatarUrl = publicProfile?.avatar_url;

    return (
        <AppBackground>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="mb-4 text-2xl font-bold text-slate-900">
                    {t("settings.title")}
                </Text>

                <View className="mb-4 gap-4 rounded-lg bg-white/95 p-4">
                    <View className="items-center gap-2">
                        <Avatar
                            src={avatarUrl}
                            name={user?.full_name}
                            size={96}
                            ring
                            onPress={handlePickImage}
                            disabled={avatarMutation.isPending}
                        />
                        <Text className="mt-2 text-sm font-medium text-[#00c4a7]">
                            {t("settings.change_photo")}
                        </Text>

                        <View className="items-center gap-1">
                            <Text className="text-xl font-bold text-slate-900">
                                {user?.full_name}
                            </Text>
                            <Text className="text-sm text-slate-500">
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mb-4 gap-3 rounded-lg bg-white/95 p-4">
                    <Text className="text-base font-semibold text-slate-900">
                        {t("settings.description")}
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder={t("settings.description_placeholder")}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="min-h-[100px] rounded-md border-2 border-[#C5C6CC] p-3 text-slate-900"
                    />
                    <Button
                        variant="primary"
                        fullWidth
                        disabled={saveProfileMutation.isPending}
                        onPress={handleSaveProfile}
                    >
                        {t("settings.save")}
                    </Button>
                </View>

                <View className="mb-4 gap-3 rounded-lg bg-white/95 p-4">
                    <Text className="text-base font-semibold text-slate-900">
                        {t("settings.my_posts")}
                    </Text>
                    {isArticlesLoading ? (
                        <ActivityIndicator />
                    ) : !userArticles?.items?.length ? (
                        <Text className="text-base text-slate-600">
                            {t("settings.no_posts")}
                        </Text>
                    ) : (
                        <View className="gap-4">
                            {userArticles.items.map((article) => (
                                <TouchableOpacity
                                    key={article.id}
                                    activeOpacity={0.85}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/articles/[id]",
                                            params: {
                                                id: String(article.id),
                                            },
                                        })
                                    }
                                >
                                    <ArticleCard article={article} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <Button
                    variant="danger"
                    fullWidth
                    onPress={() => {
                        void logout();
                    }}
                >
                    {t("settings.logout")}
                </Button>
            </ScrollView>
        </AppBackground>
    );
};

export default SettingsScreen;
