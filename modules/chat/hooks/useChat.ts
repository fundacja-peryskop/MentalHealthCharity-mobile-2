import { useCallback, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "@/api";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Pagination } from "@/modules/shared/types";
import { getChatById } from "@/modules/chat/queries/getChatByIdQuery";
import { fetchChatHistory } from "@/modules/chat/queries/chatHistoryQueryOptions";
import { markAsReadMutation } from "@/modules/chat/queries/markAsReadMutation";
import deleteChatMessageMutation from "@/modules/chat/queries/deleteChatMessageMutation";
import sendChatMessageMutation from "@/modules/chat/queries/sendChatMessageMutation";
import { Chat, ChatDeleteEvent, Message, SocketEventType } from "../types";
import { UnknownUser } from "../constants";

type SocketConnectionStatus =
    | "idle"
    | "connecting"
    | "open"
    | "closed"
    | "error";

type IncomingSocketMessage =
    | (Partial<Message> & {
          sender_id?: number;
          is_read?: boolean;
      })
    | (Partial<ChatDeleteEvent> & {
          message_id?: number;
          type?: string;
      });

const sortMessagesOldestFirst = (messages: Message[]) => {
    return [...messages].sort((a, b) => {
        const aTime = new Date(a.creation_date).getTime();
        const bTime = new Date(b.creation_date).getTime();

        return (
            (Number.isNaN(aTime) ? 0 : aTime) -
            (Number.isNaN(bTime) ? 0 : bTime)
        );
    });
};

const getMessageSender = (
    payload: IncomingSocketMessage,
    chat: Chat | undefined,
) => {
    if ("sender" in payload && payload.sender) {
        return payload.sender;
    }

    const senderId = "sender_id" in payload ? payload.sender_id : undefined;

    return (
        chat?.participants.find((participant) => participant.id === senderId) ??
        UnknownUser
    );
};

const normalizeMessage = (
    message: Message,
    chatId: string,
    chat: Chat | undefined,
) => {
    return {
        ...message,
        chat_id: message.chat_id ?? Number(chatId),
        id: Number(message.id),
        sender:
            message.sender ??
            chat?.participants.find(
                (participant) => participant.id === message.sender?.id,
            ) ??
            UnknownUser,
    } satisfies Message;
};

const parseSocketMessage = (
    rawData: WebSocketMessageEvent["data"],
    chat: Chat | undefined,
) => {
    console.log("[WebSocket] Parsing raw data:", rawData);
    if (typeof rawData !== "string") {
        console.log("[WebSocket] Raw data is not a string, skipping");
        return null;
    }

    try {
        const payload = JSON.parse(rawData) as IncomingSocketMessage;
        console.log("[WebSocket] Parsed payload:", payload);
        const event = "event" in payload ? payload.event : undefined;
        const type = "type" in payload ? payload.type : undefined;
        const deleteMessageId =
            "message_id" in payload ? payload.message_id : payload.id;
        const isDeleteInstruction =
            event === SocketEventType.DELETE ||
            type === SocketEventType.DELETE ||
            event === "delete" ||
            type === "delete";

        if (isDeleteInstruction && deleteMessageId) {
            console.log(
                "[WebSocket] Delete instruction detected for message:",
                deleteMessageId,
            );
            return {
                type: SocketEventType.DELETE,
                id: Number(deleteMessageId),
            };
        }

        if (!("content" in payload) || !payload.content || !payload.id) {
            console.log("[WebSocket] Missing required fields in payload");
            return null;
        }

        return {
            type: SocketEventType.MESSAGE,
            message: {
                chat_id: Number(payload.chat_id ?? chat?.id ?? 0),
                content: payload.content,
                creation_date:
                    payload.creation_date ?? new Date().toISOString(),
                id: Number(payload.id),
                sender: getMessageSender(payload, chat),
            } satisfies Message,
        };
    } catch (error) {
        console.error("Failed to parse socket message:", error);
        return null;
    }
};

const fetchAllChatHistory = async (chatId: number | string) => {
    const pageSize = 100;
    const firstPage = await fetchChatHistory({
        chatId,
        page: 1,
        size: pageSize,
    });
    const allMessages = [...firstPage.items];
    const totalPages = firstPage.pages ?? 1;

    for (let page = 2; page <= totalPages; page += 1) {
        const nextPage: Pagination<Message> = await fetchChatHistory({
            chatId,
            page,
            size: pageSize,
        });
        allMessages.push(...nextPage.items);
    }

    return sortMessagesOldestFirst(allMessages);
};

export const useChat = (
    chatId: string,
    options?: { onSendError?: (error: unknown) => void },
) => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [socketUrl, setSocketUrl] = useState<string>();
    const [connectionStatus, setConnectionStatus] =
        useState<SocketConnectionStatus>("idle");
    const { onSendError } = options ?? {};
    const chatQuery = useQuery({
        ...getChatById({ id: chatId }),
        enabled: Boolean(chatId),
    });

    const historyQuery = useQuery<Message[]>({
        queryKey: ["messages", chatId],
        queryFn: () => fetchAllChatHistory(chatId),
        enabled: Boolean(chatId),
    });

    const markAsRead = useMutation({
        mutationFn: markAsReadMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });

    const sendMessage = useMutation({
        mutationFn: sendChatMessageMutation,
    });

    const deleteMessage = useMutation({
        mutationFn: deleteChatMessageMutation,
    });

    useEffect(() => {
        if (historyQuery.data) {
            setMessages(historyQuery.data);
        }
    }, [historyQuery.data]);

    useEffect(() => {
        if (chatId) {
            markAsRead.mutate({ id: Number(chatId) });
        }
        // Mark as read only when the conversation is opened.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    useEffect(() => {
        const prepareSocketUrl = async () => {
            const token = await SecureStore.getItemAsync("token");

            if (!token || !chatId) {
                console.log(
                    "[WebSocket] Missing token or chatId, skipping connection",
                );
                return;
            }

            const wsUrl = url.chat.connect({ token, chat_id: chatId });
            console.log("[WebSocket] Connecting to:", wsUrl);
            setSocketUrl(wsUrl);
        };

        void prepareSocketUrl();
    }, [chatId]);

    const upsertMessage = useCallback((nextMessage: Message) => {
        setMessages((currentMessages) => {
            const withoutDuplicate = currentMessages.filter((message) => {
                const isSameMessage = message.id === nextMessage.id;
                const isMatchingPending =
                    message.isPending &&
                    !message.isFailed &&
                    message.content === nextMessage.content &&
                    message.sender.id === nextMessage.sender.id;

                return !isSameMessage && !isMatchingPending;
            });

            return sortMessagesOldestFirst([...withoutDuplicate, nextMessage]);
        });
    }, []);

    useEffect(() => {
        if (!socketUrl) {
            console.log("[WebSocket] No socketUrl, skipping connection");
            return undefined;
        }

        console.log("[WebSocket] Creating new WebSocket connection");
        setConnectionStatus("connecting");
        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            console.log("[WebSocket] Connection opened");
            setConnectionStatus("open");
        };
        socket.onclose = (event) => {
            console.log(
                "[WebSocket] Connection closed:",
                event.code,
                event.reason,
            );
            setConnectionStatus("closed");
        };
        socket.onerror = (error) => {
            console.log("[WebSocket] Connection error:", error);
            setConnectionStatus("error");
        };
        socket.onmessage = (event) => {
            console.log("[WebSocket] Message received:", event.data);
            const parsedMessage = parseSocketMessage(
                event.data,
                chatQuery.data,
            );

            if (!parsedMessage) {
                console.log("[WebSocket] Failed to parse message");
                return;
            }

            console.log("[WebSocket] Parsed message:", parsedMessage);

            if (parsedMessage.type === SocketEventType.DELETE) {
                setMessages((currentMessages) =>
                    currentMessages.filter(
                        (message) => message.id !== parsedMessage.id,
                    ),
                );
                return;
            }

            if ("message" in parsedMessage && parsedMessage.message) {
                upsertMessage(parsedMessage.message);
            }
        };

        return () => {
            console.log("[WebSocket] Cleaning up connection");
            socket.close();
        };
    }, [chatQuery.data, socketUrl, upsertMessage]);

    const handleSendMessage = () => {
        const content = messageText.trim();

        if (!content || !user) {
            return;
        }

        const temporaryId = -Date.now();
        const pendingMessage: Message = {
            chat_id: Number(chatId),
            content,
            creation_date: new Date().toISOString(),
            id: temporaryId,
            isPending: true,
            sender: user,
        };

        setMessages((currentMessages) =>
            sortMessagesOldestFirst([...currentMessages, pendingMessage]),
        );
        setMessageText("");

        sendMessage.mutate(
            { chatId, content },
            {
                onSuccess: (sentMessage) => {
                    if (!sentMessage) {
                        return;
                    }

                    upsertMessage(
                        normalizeMessage(sentMessage, chatId, chatQuery.data),
                    );
                },
                onError: (error) => {
                    setMessages((currentMessages) =>
                        currentMessages.map((message) =>
                            message.id === temporaryId
                                ? {
                                      ...message,
                                      isFailed: true,
                                      isPending: false,
                                  }
                                : message,
                        ),
                    );
                    setMessageText(content);
                    onSendError?.(error);
                },
            },
        );
    };

    const handleDeleteMessage = (messageId: number) => {
        deleteMessage.mutate({ id: messageId });
    };

    const participantNames = useMemo(() => {
        return (
            chatQuery.data?.participants
                .map((participant) => participant.full_name)
                .join(", ") ?? ""
        );
    }, [chatQuery.data?.participants]);

    return {
        chat: chatQuery.data,
        connectionStatus,
        handleDeleteMessage,
        handleSendMessage,
        isDeletingMessage: deleteMessage.isPending,
        isLoading: chatQuery.isLoading || historyQuery.isLoading,
        isSendingMessage: sendMessage.isPending,
        messageText,
        messages,
        participantNames,
        setMessageText,
        user,
    };
};
