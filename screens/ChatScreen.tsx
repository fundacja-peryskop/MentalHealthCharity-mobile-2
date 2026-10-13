import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "@/modules/shared/components/Loader";
import { useToast } from "@/modules/shared/components/Toast";
import { Message } from "@/modules/chat/types";
import { useChat } from "@/modules/chat/hooks/useChat";
import AppBackground from "@/modules/shared/components/App-Background";

const formatMessageDate = (date: string) => {
    return new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const connectionLabel = {
    idle: "Laczenie...",
    connecting: "Laczenie...",
    open: "Online",
    closed: "Rozlaczono",
    error: "Blad polaczenia",
};

const ChatScreen = () => {
    const listRef = useRef<FlatList<Message>>(null);
    const params = useLocalSearchParams<{ id?: string }>();
    const chatId = params.id ?? "";
    const { showToast } = useToast();
    const getSendErrorMessage = (error: unknown) => {
        if (
            error &&
            typeof error === "object" &&
            "message" in error &&
            typeof error.message === "string"
        ) {
            return error.message;
        }

        return "Nie udalo sie wyslac wiadomosci";
    };
    const {
        chat,
        connectionStatus,
        handleDeleteMessage,
        handleSendMessage,
        isDeletingMessage,
        isLoading,
        isSendingMessage,
        messageText,
        messages,
        participantNames,
        setMessageText,
        user,
    } = useChat(chatId, {
        onSendError: (error) => {
            showToast({
                type: "error",
                title: "Blad wysylania",
                description: getSendErrorMessage(error),
                duration: 4000,
            });
        },
    });

    useEffect(() => {
        if (messages.length === 0) {
            return;
        }

        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    }, [messages.length]);

    const renderMessage = ({ item }: { item: Message }) => {
        const isCurrentUser = item.sender.id === user?.id;
        const canDeleteMessage = !item.isPending && isCurrentUser;

        return (
            <View
                className={`mb-3 max-w-[84%] ${
                    isCurrentUser ? "self-end" : "self-start"
                }`}
            >
                {!isCurrentUser ? (
                    <Text className="mb-1 text-xs font-semibold text-slate-500">
                        {item.sender.full_name}
                    </Text>
                ) : null}

                <View
                    className={`rounded-lg px-4 py-3 ${
                        isCurrentUser ? "bg-primary" : "bg-white"
                    } ${item.isFailed ? "border border-error" : ""}`}
                >
                    <Text
                        className={`text-base leading-5 ${
                            isCurrentUser ? "text-white" : "text-slate-900"
                        }`}
                    >
                        {item.content}
                    </Text>

                    <View className="mt-2 flex-row items-center justify-between gap-3">
                        <Text
                            className={`text-[11px] ${
                                isCurrentUser
                                    ? "text-white/80"
                                    : "text-slate-500"
                            }`}
                        >
                            {item.isPending
                                ? "Wysylanie..."
                                : item.isFailed
                                  ? "Nie wyslano"
                                  : formatMessageDate(item.creation_date)}
                        </Text>

                        {canDeleteMessage ? (
                            <Pressable
                                disabled={isDeletingMessage}
                                onPress={() => handleDeleteMessage(item.id)}
                                accessibilityRole="button"
                                accessibilityLabel="Usun wiadomosc"
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={16}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Loader />
                <Text className="mt-4 text-slate-600">Ladowanie czatu...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-50"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <AppBackground>
                <View className="border-b border-slate-200 bg-white px-4 pb-4 pt-12">
                    <View className="flex-row items-center gap-3">
                        <Pressable
                            onPress={() => router.back()}
                            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                            accessibilityRole="button"
                            accessibilityLabel="Wroc"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={22}
                                color="#0F172A"
                            />
                        </Pressable>

                        <View className="min-w-0 flex-1">
                            <Text
                                className="text-lg font-bold text-slate-950"
                                numberOfLines={1}
                            >
                                {chat?.name ?? "Czat"}
                            </Text>
                            <Text
                                className="text-xs text-slate-500"
                                numberOfLines={1}
                            >
                                {participantNames}
                            </Text>
                        </View>

                        <View className="items-end">
                            <View
                                className={`h-2.5 w-2.5 rounded-full ${
                                    connectionStatus === "open"
                                        ? "bg-primary"
                                        : "bg-slate-400"
                                }`}
                            />
                            <Text className="mt-1 text-[11px] text-slate-500">
                                {connectionLabel[connectionStatus]}
                            </Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderMessage}
                    contentContainerClassName="px-4 py-4"
                    onContentSizeChange={() =>
                        listRef.current?.scrollToEnd({ animated: false })
                    }
                    ListEmptyComponent={
                        <View className="items-center px-6 py-16">
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={42}
                                color="#94A3B8"
                            />
                            <Text className="mt-4 text-center text-base font-semibold text-slate-900">
                                Brak wiadomosci
                            </Text>
                        </View>
                    }
                />

                <View className="border-t border-slate-200 bg-white p-3">
                    <View className="flex-row items-end gap-2">
                        <TextInput
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                            placeholder="Napisz wiadomosc..."
                            className="max-h-32 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-950"
                        />
                        <Pressable
                            disabled={!messageText.trim() || isSendingMessage}
                            onPress={handleSendMessage}
                            className={`h-12 w-12 items-center justify-center rounded-full ${
                                messageText.trim() && !isSendingMessage
                                    ? "bg-primary"
                                    : "bg-slate-300"
                            }`}
                            accessibilityRole="button"
                            accessibilityLabel="Wyslij wiadomosc"
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>
            </AppBackground>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
