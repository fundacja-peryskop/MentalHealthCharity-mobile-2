import { url } from "@/api";
import getAuthHeaders from "@/modules/auth/helpers/getAuthHeaders";
import Errors from "@/modules/shared/constants";
import { ErrorMessage } from "@/modules/shared/types";
import { Message, SendMessagePayload } from "@/modules/chat/types";

const extractServerMessage = (body: string): string | undefined => {
    try {
        const data = JSON.parse(body) as { detail?: unknown };

        if (typeof data.detail === "string") {
            return data.detail;
        }

        if (Array.isArray(data.detail)) {
            const first = data.detail.find(
                (item) =>
                    item &&
                    typeof item === "object" &&
                    "msg" in item &&
                    typeof item.msg === "string",
            );

            if (first && "msg" in first) {
                return String(first.msg);
            }
        }
    } catch {
        return undefined;
    }

    return undefined;
};

const sendChatMessageMutation = async ({
    chatId,
    content,
}: SendMessagePayload): Promise<Message | undefined> => {
    const headers = getAuthHeaders();
    const response = await fetch(url.chat.sendMessage({ chatId }), {
        method: "POST",
        headers,
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const rawBody = await response.text();

        console.warn(
            "Send message failed:",
            response.status,
            response.statusText,
            rawBody,
        );

        throw new Error(
            extractServerMessage(rawBody) ?? Errors[ErrorMessage.UNKNOWN],
        );
    }

    if (response.status === 204) {
        return undefined;
    }

    return response.json();
};

export default sendChatMessageMutation;
