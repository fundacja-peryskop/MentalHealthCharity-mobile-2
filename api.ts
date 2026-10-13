import buildQuery from "./helpers/buildQuery";
import {
    ArticleCategoryOptions,
    ReadArticleOptions,
    ReadArticlesByUserOptions,
    ReadArticlesOptions,
    ReadPublicArticlesOptions,
    SearchPublicArticlesOptions,
    UpdateArticleOptions,
} from "@/modules/articles/types";
import {
    ReadSearchUsersOptions,
    ReadUserByIdOptions,
} from "@/modules/users/types";
import {
    ChatContractOptions,
    ChatNoteOptions,
    ConnectOptions,
    ConnectUnreadMessagesOptions,
    DeleteMessageOptions,
    EditChatOptions,
    GetChatMessagesOptions,
    MarkAsReadMutationOptions,
    ParticipantOptions,
    ReadChatOptions,
    SearchChatQueryOptions,
    SendMessageOptions,
} from "@/modules/chat/types";
import {
    CanUserSendFormOptions,
    FormOptions,
    ReadAllFormOptions,
} from "@/modules/forms/types";

export const baseUrl = process.env.EXPO_PUBLIC_API_URL;
export const websocketUrl = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

export const url = {
    login: {
        loginAccessToken: `${baseUrl}login/access-token`,
        testToken: `${baseUrl}login/test-token`,
    },
    users: {
        searchUser(options: ReadSearchUsersOptions) {
            const query = buildQuery(options);

            return `${baseUrl}users/?${query}`;
        },
        readUserById({ id }: ReadUserByIdOptions) {
            return `${baseUrl}users/${id}`;
        },
        updateUser({ id }: ReadUserByIdOptions) {
            return `${baseUrl}users/${id}`;
        },
        updateUserAvatar({ id }: ReadUserByIdOptions) {
            return `${baseUrl}user-public-profile/${id}/avatar`;
        },
        updatePublicProfile({ id }: ReadUserByIdOptions) {
            return `${baseUrl}user-public-profile/${id}`;
        },
        readPublicProfile({ id }: ReadUserByIdOptions) {
            return `${baseUrl}user-public-profile/${id}`;
        },
        updateUserByAdmin({ id }: ReadUserByIdOptions) {
            return `${baseUrl}users/${id}/edit-as-admin`;
        },
        createUser: `${baseUrl}users/`,
        changePasswordBegin: `${baseUrl}users/reset-password-mail`,
        changePasswordComplete: `${baseUrl}users/change-password`,
        confirmEmailComplete: `${baseUrl}users/confirm`,
        readUsersMe: `${baseUrl}users/me`,
        updateUserMe: `${baseUrl}users/me`,
        createUserOpen: `${baseUrl}users/open`,
        changePassword: `${baseUrl}users/change-password`,
        resetPassword: `${baseUrl}users/reset-password`,
    },
    articles: {
        create: `${baseUrl}article/`,
        readArticles(options: ReadArticlesOptions) {
            const query = buildQuery(options);
            return `${baseUrl}article?${query}`;
        },
        readPublicArticles(options: ReadPublicArticlesOptions) {
            const query = buildQuery(options);
            return `${baseUrl}article/public?${query}`;
        },
        readById({ id }: ReadArticleOptions) {
            return `${baseUrl}article/${id}/detail`;
        },
        searchPublicArticles(options: SearchPublicArticlesOptions) {
            const query = buildQuery(options);
            return `${baseUrl}article/public/search?${query}`;
        },
        readByUser({ author, ...props }: ReadArticlesByUserOptions) {
            const query = buildQuery(props);
            return `${baseUrl}article/public/user/${author}?${query}`;
        },
        update({ id }: UpdateArticleOptions) {
            return `${baseUrl}article/${id}`;
        },
        updateBanner({ id }: UpdateArticleOptions) {
            return `${baseUrl}article/${id}/banner`;
        },
        delete({ id }: UpdateArticleOptions) {
            return `${baseUrl}article/${id}`;
        },
    },
    articleCategories: {
        update({ id }: ArticleCategoryOptions) {
            return `${baseUrl}article-category/${id}`;
        },
        delete({ id }: ArticleCategoryOptions) {
            return `${baseUrl}article-category/${id}`;
        },
        changeStatus({ id }: ArticleCategoryOptions) {
            return `${baseUrl}article-category/${id}/change-status`;
        },
        read: `${baseUrl}article-category/`,
        create: `${baseUrl}article-category/`,
    },
    chat: {
        readChats(options: SearchChatQueryOptions) {
            const query = buildQuery(options);
            return `${baseUrl}chat/?${query}`;
        },
        readChat({ id }: ReadChatOptions) {
            return `${baseUrl}chat/${id}`;
        },
        markAsRead({ id }: MarkAsReadMutationOptions) {
            return `${baseUrl}chat/${id}/mark-as-read`;
        },
        readChatUsers({ id }: ReadChatOptions) {
            return `${baseUrl}chat/${id}/user/`;
        },
        deleteMessage({ id }: DeleteMessageOptions) {
            return `${baseUrl}message/${id}`;
        },
        sendMessage({ chatId }: SendMessageOptions) {
            return `${baseUrl}message/${chatId}`;
        },
        getNoteForChat({ id }: ChatNoteOptions) {
            return `${baseUrl}chat-note/chat/${id}`;
        },
        editChat({ id }: EditChatOptions) {
            return `${baseUrl}chat/${id}`;
        },
        closeChat({ id }: ReadChatOptions) {
            return `${baseUrl}chat/${id}/deactivate`;
        },
        editNote({ id }: ChatNoteOptions) {
            return `${baseUrl}chat-note/chat/${id}`;
        },
        getContractForChat({ id }: ChatContractOptions) {
            return `${baseUrl}contract/chat/${id}`;
        },
        editContract({ id }: ChatContractOptions) {
            return `${baseUrl}contract/chat/${id}`;
        },
        confirmContract({ id }: ChatContractOptions) {
            return `${baseUrl}contract/chat/${id}/confirm`;
        },
        addParticipant({ chat_id, participant_id }: ParticipantOptions) {
            return `${baseUrl}chat/${chat_id}/participant/${participant_id}`;
        },
        removeParticipant({
            chat_id,
            participant_id,
            auto_rematch,
        }: ParticipantOptions) {
            const query =
                auto_rematch === undefined
                    ? ""
                    : `?auto_rematch=${auto_rematch}`;
            return `${baseUrl}chat/${chat_id}/participant/${participant_id}${query}`;
        },
        readMessages({ chatId, ...options }: GetChatMessagesOptions) {
            const query = buildQuery(options);
            return `${baseUrl}message/${chatId}?${query}`;
        },
        connect(options: ConnectOptions) {
            const query = buildQuery(options);
            return `${websocketUrl}/ws-chat?${query}`;
        },
        connectUnreadMessages(options: ConnectUnreadMessagesOptions) {
            const query = buildQuery(options);
            return `${websocketUrl}/ws-unread-chats?${query}`;
        },
    },

    form: {
        readById({ id }: FormOptions) {
            return `${baseUrl}form/${id}`;
        },
        update({ id }: FormOptions) {
            return `${baseUrl}form/${id}`;
        },
        delete({ id }: FormOptions) {
            return `${baseUrl}form/${id}`;
        },
        accept({ id }: FormOptions) {
            return `${baseUrl}form/${id}/accept`;
        },
        reject({ id }: FormOptions) {
            return `${baseUrl}form/${id}/reject`;
        },
        read(options: ReadAllFormOptions) {
            const query = buildQuery(options);
            return `${baseUrl}form/?${query}`;
        },
        updateNote({ id }: FormOptions) {
            return `${baseUrl}form/${id}/notes`;
        },
        create: `${baseUrl}form/`,
        canUserSendForm(options?: CanUserSendFormOptions) {
            const query = buildQuery(options ?? {});
            return query
                ? `${baseUrl}form/can-send-form?${query}`
                : `${baseUrl}form/can-send-form`;
        },
    },
};
