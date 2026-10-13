import { useState } from "react";
import {
    FlatList,
    GestureResponderEvent,
    Platform,
    Pressable,
    PressableProps,
    RefreshControl,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/modules/shared/components/Loader";
import { Chat } from "@/modules/chat/types";
import { useChatList } from "@/modules/chat/hooks/useChatList";
import ChatParticipantsModal from "@/modules/chat/components/ChatParticipantsModal";
import { useTranslation } from "react-i18next";
import AppBackground from "@/modules/shared/components/App-Background";
import { Avatar, Button, Badge, Typography } from "@fundacja-peryskop/ui";

type ChatRowPressProps = PressableProps & {
    /** Right-click handler — supported by react-native-web only. */
    onContextMenu?: (event: GestureResponderEvent) => void;
};

const formatLastMessageDate = (date?: string) => {
    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const getLastMessagePreview = (chat: Chat, fallback: string) => {
    if (!chat.last_message?.content) {
        return fallback;
    }

    return chat.last_message.content;
};

const getChatAvatar = (chat: Chat) => {
    return chat.participants.find((participant) => participant.chat_avatar_url)
        ?.chat_avatar_url;
};

const ChatListScreen = () => {
    const { t } = useTranslation();
    const {
        canManageChats,
        chats,
        error,
        handleDeleteChat,
        handleOpenChat,
        isDeletingChat,
        isLoading,
        isRefetching,
        isWaitingForAssignment,
        refetch,
    } = useChatList();

    const [participantsChat, setParticipantsChat] = useState<Chat | null>(null);

    const renderChat = ({ item }: { item: Chat }) => {
        const avatar = getChatAvatar(item);

        const chatRowPressProps: ChatRowPressProps =
            Platform.OS === "web"
                ? {
                      onContextMenu: (event: GestureResponderEvent) => {
                          (
                              event as unknown as {
                                  preventDefault?: () => void;
                              }
                          ).preventDefault?.();
                          setParticipantsChat(item);
                      },
                  }
                : {};

        return (
            <Pressable
                onPress={() => handleOpenChat(item.id)}
                onLongPress={() => setParticipantsChat(item)}
                delayLongPress={400}
                accessibilityHint={t("chat_list.participants_hint")}
                {...chatRowPressProps}
                className="mx-4 mb-3 flex-row items-center gap-3 rounded-lg border border-slate-100 bg-white p-4 shadow-sm active:bg-slate-50"
            >
                <Avatar
                    src={avatar}
                    name={item.name}
                    size={48}
                    ring
                    className="bg-primary/10"
                />

                <View className="min-w-0 flex-1">
                    <View className="mb-1 flex-row items-start justify-between gap-3">
                        <Typography
                            variant="regularSemibold"
                            className="flex-1 text-slate-950"
                            numberOfLines={1}
                        >
                            {item.name}
                        </Typography>
                        <Typography
                            variant="tinyRegular"
                            className="text-slate-500"
                        >
                            {formatLastMessageDate(
                                item.last_message?.creation_date,
                            )}
                        </Typography>
                    </View>

                    <Typography
                        variant="smallRegular"
                        className="text-slate-600"
                        numberOfLines={2}
                    >
                        {getLastMessagePreview(
                            item,
                            t("chat_list.no_messages"),
                        )}
                    </Typography>
                </View>

                <View className="items-end gap-3">
                    {item.unread_count > 0 ? (
                        <Badge tone="primary" size="sm" dotColor="$primary">
                            {item.unread_count > 99 ? "99+" : item.unread_count}
                        </Badge>
                    ) : null}

                    {canManageChats ? (
                        <Button
                            variant="danger"
                            outlined
                            disabled={isDeletingChat}
                            onPress={(event) => {
                                event.stopPropagation();
                                handleDeleteChat(item.id);
                            }}
                            aria-label={t(
                                "chat_list.delete_accessibility_label",
                                { name: item.name },
                            )}
                            className="h-9 w-9 p-0"
                        >
                            <Ionicons
                                name="trash-outline"
                                size={18}
                                color="#FF3D47"
                            />
                        </Button>
                    ) : null}
                </View>
            </Pressable>
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                <Loader />
                <Typography
                    variant="regularRegular"
                    className="mt-4 text-center text-slate-600"
                >
                    {t("chat_list.loading")}
                </Typography>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={42}
                    color="#FF3D47"
                />
                <Typography
                    variant="largeSemibold"
                    className="mt-4 text-center text-slate-950"
                >
                    {t("chat_list.fetch_error_title")}
                </Typography>
                <Typography
                    variant="smallRegular"
                    className="mt-2 text-center text-slate-600"
                >
                    {t("chat_list.fetch_error_description")}
                </Typography>
            </View>
        );
    }

    if (isWaitingForAssignment) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={44}
                    color="#06B7A7"
                />
                <Typography
                    variant="largeSemibold"
                    className="mt-4 text-center text-slate-950"
                >
                    {t("chat_list.waiting_title")}
                </Typography>
                <Typography
                    variant="smallRegular"
                    className="mt-2 text-center text-slate-600"
                >
                    {t("chat_list.waiting_description")}
                </Typography>
            </View>
        );
    }

    return (
        <AppBackground>
            <View className="px-4 pb-3 pt-12">
                <Typography variant="title2" className="text-slate-950">
                    {t("navigation.chats")}
                </Typography>
            </View>

            <FlatList
                data={chats}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderChat}
                contentContainerClassName="pb-6"
                ListEmptyComponent={
                    <View className="items-center px-6 py-12">
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={42}
                            color="#94A3B8"
                        />
                        <Typography
                            variant="regularSemibold"
                            className="mt-4 text-center text-slate-900"
                        >
                            {t("chat_list.empty")}
                        </Typography>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
            />

            <ChatParticipantsModal
                chat={participantsChat}
                onClose={() => setParticipantsChat(null)}
            />
        </AppBackground>
    );
};

export default ChatListScreen;
