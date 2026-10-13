import { ReadyState } from "react-use-websocket";
import { t } from "i18next";
import { User } from "../auth/types";
import { Roles } from "../users/constants";

export const UnknownUser: User = {
    email: "unknown",
    id: 999999,
    full_name: "ERROR",
    is_assigned_to_chat: false,
    excluded_from_automation: false,
    user_role: Roles.USER,
    chat_avatar_url: "",
};

export const translatedConnectionStatus: Record<ReadyState, string> = {
    [ReadyState.CLOSED]: t("chat.connection_closed"),
    [ReadyState.CLOSING]: t("chat.connection_closing"),
    [ReadyState.CONNECTING]: t("chat.connection_connecting"),
    [ReadyState.OPEN]: t("chat.connection_open"),
    [ReadyState.UNINSTANTIATED]: t("chat.connection_uninstantiated"),
};

export enum ChatSortByOptions {
    LATEST_MESSAGE_DATE = "latest_message",
}
