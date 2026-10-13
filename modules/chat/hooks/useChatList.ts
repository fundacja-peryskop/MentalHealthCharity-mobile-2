import { useMemo } from "react";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { canUserSendFormQuery } from "@/modules/forms/queries/canUserSendFormQuery";
import { formTypes } from "@/modules/forms/types";
import { Roles } from "@/modules/users/constants";
import { Chat, SearchChatQueryOptions } from "@/modules/chat/types";
import { ChatSortByOptions } from "@/modules/chat/constants";
import getChatsMutation from "@/modules/chat/queries/getChatsQuery";
import closeChatMutation from "@/modules/chat/queries/closeChatMutation";

const getChatSortTime = (chat: Chat) => {
    const date = chat.last_message?.creation_date ?? chat.creation_date;
    const time = new Date(date).getTime();

    return Number.isNaN(time) ? 0 : time;
};

export const useChatList = () => {
    const { user, isFetchingUser } = useUser();
    const queryClient = useQueryClient();
    const canRedirectToMenteeForm = user?.user_role === Roles.USER;
    const canManageChats =
        user?.user_role === Roles.ADMIN ||
        user?.user_role === Roles.VOLUNTEERSUPERVISOR;

    const chatListOptions: SearchChatQueryOptions = {
        page: 1,
        size: 50,
        status: "active",
        unread_first: true,
        sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
    };

    const formAvailability = useQuery({
        ...canUserSendFormQuery({ form_type: formTypes.MENTEE }),
        enabled: canRedirectToMenteeForm,
    });

    const chatsQuery = useQuery({
        queryKey: ["chats", chatListOptions],
        queryFn: () => getChatsMutation(chatListOptions),
        enabled:
            Boolean(user) &&
            (!canRedirectToMenteeForm ||
                formAvailability.data?.can_send_form === false),
    });

    const closeChat = useMutation({
        mutationFn: closeChatMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });

    const chats = useMemo(() => {
        const items = chatsQuery.data?.items ?? [];

        return [...items].sort((a, b) => {
            const unreadDiff =
                Number(b.unread_count > 0) - Number(a.unread_count > 0);

            if (unreadDiff !== 0) {
                return unreadDiff;
            }

            return getChatSortTime(b) - getChatSortTime(a);
        });
    }, [chatsQuery.data?.items]);

    const isCheckingForm = canRedirectToMenteeForm
        ? formAvailability.isLoading || formAvailability.isFetching
        : false;
    const isLoading = isFetchingUser || isCheckingForm || chatsQuery.isLoading;
    const isWaitingForAssignment =
        canRedirectToMenteeForm &&
        formAvailability.data?.can_send_form === false &&
        !isLoading &&
        chats.length === 0;

    const handleOpenChat = (chatId: number) => {
        router.push({
            pathname: "/chats/[id]",
            params: { id: String(chatId) },
        });
    };

    const handleDeleteChat = (chatId: number) => {
        closeChat.mutate({ id: chatId });
    };

    return {
        canManageChats,
        chats,
        error: chatsQuery.error ?? formAvailability.error,
        handleDeleteChat,
        handleOpenChat,
        isDeletingChat: closeChat.isPending,
        isLoading,
        isRefetching: chatsQuery.isFetching,
        isWaitingForAssignment,
        refetch: chatsQuery.refetch,
    };
};
