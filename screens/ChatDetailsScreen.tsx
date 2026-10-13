import {
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useChat } from "@/modules/chat/hooks/useChat";
import { useTranslation } from "react-i18next";
import { useToast } from "@/modules/shared/components/Toast";
import { Roles } from "@/modules/users/constants";

const statusBarHeight =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;

const ChatDetailsScreen = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const params = useLocalSearchParams<{ id?: string }>();
    const chatId = params.id ?? "";
    const { canManageChats, chat, handleCloseChat, isClosingChat, isLoading } =
        useChat(chatId);

    useEffect(() => {
        if (chat?.status === "CLOSED" || chat?.status === "ARCHIVED") {
            router.back();
        }
    }, [chat]);

    if (isLoading || !chat) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Text className="text-slate-600">Ładowanie...</Text>
            </View>
        );
    }

    const isActive = chat.is_active && chat.status === "ACTIVE";

    return (
        <View className="flex-1 bg-slate-50">
            <View className="border-b border-slate-200 bg-white px-4 pb-4 pt-12">
                <View className="flex-row items-center gap-3">
                    <Button
                        variant="secondary"
                        outlined
                        onPress={() => router.back()}
                        aria-label="Wróć"
                        className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color="#0F172A"
                        />
                    </Button>

                    <View className="min-w-0 flex-1">
                        <Text
                            className="text-lg font-bold text-slate-950"
                            numberOfLines={1}
                        >
                            {t("chat.details_title") || "Szczegóły czatu"}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerClassName="px-4 py-6"
                keyboardShouldPersistTaps="handled"
            >
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-600 mb-3">
                        {t("chat.info_section") || "Informacje o czacie"}
                    </Text>
                    <View className="bg-white rounded-lg border border-slate-200 p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-sm text-slate-500">
                                {t("chat.status") || "Status"}
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <View
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        isActive ? "bg-primary" : "bg-slate-400"
                                    }`}
                                />
                                <Text className="text-sm font-medium">
                                    {isActive
                                        ? t("chat.active") || "Aktywny"
                                        : t("chat.inactive") || "Nieaktywny"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-sm text-slate-500">
                                {t("chat.created_at") || "Data utworzenia"}
                            </Text>
                            <Text className="text-sm text-slate-900">
                                {new Date(
                                    chat.creation_date,
                                ).toLocaleDateString("pl-PL", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </View>

                        {chat.closed_at && (
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm text-slate-500">
                                    {t("chat.closed_at") || "Data zamknięcia"}
                                </Text>
                                <Text className="text-sm text-slate-900">
                                    {new Date(
                                        chat.closed_at,
                                    ).toLocaleDateString("pl-PL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-600 mb-3">
                        {t("chat.participants") || "Uczestnicy"} (
                        {chat.participants.length})
                    </Text>
                    <View className="bg-white rounded-lg border border-slate-200">
                        {chat.participants.map((participant) => (
                            <Pressable
                                key={participant.id}
                                className="flex-row items-center gap-3 p-4 border-b border-slate-100 last:border-b-0"
                            >
                                <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                                    {participant.chat_avatar_url ? (
                                        <View className="h-full w-full" />
                                    ) : (
                                        <Ionicons
                                            name="person-outline"
                                            size={22}
                                            color="#06B7A7"
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-slate-900">
                                        {participant.full_name}
                                    </Text>
                                    <Text className="text-xs text-slate-500">
                                        {participant.email}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    {participant.user_role === Roles.ADMIN && (
                                        <View className="px-2 py-0.5 rounded-full bg-purple-100">
                                            <Text className="text-xs font-medium text-purple-700">
                                                Admin
                                            </Text>
                                        </View>
                                    )}
                                    {participant.user_role ===
                                        Roles.VOLUNTEER && (
                                        <View className="px-2 py-0.5 rounded-full bg-blue-100">
                                            <Text className="text-xs font-medium text-blue-700">
                                                Wolontariusz
                                            </Text>
                                        </View>
                                    )}
                                    {participant.user_role === Roles.USER && (
                                        <View className="px-2 py-0.5 rounded-full bg-green-100">
                                            <Text className="text-xs font-medium text-green-700">
                                                Podopieczny
                                            </Text>
                                        </View>
                                    )}
                                    {participant.user_role ===
                                        Roles.VOLUNTEERSUPERVISOR && (
                                        <View className="px-2 py-0.5 rounded-full bg-orange-100">
                                            <Text className="text-xs font-medium text-orange-700">
                                                Superwizor
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {canManageChats && (
                    <View className="pt-4 border-t border-slate-200">
                        <Text className="mt-2 text-center text-xs text-slate-500">
                            {t("chat.close_chat_description") ||
                                "Po zamknięciu czatu uczestnicy nie będą mogli wysyłać wiadomości."}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default ChatDetailsScreen;
