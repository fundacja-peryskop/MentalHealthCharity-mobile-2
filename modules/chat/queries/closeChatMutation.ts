import { url } from "@/api";
import getAuthHeaders from "@/modules/auth/helpers/getAuthHeaders";
import handleApiError from "@/modules/shared/helpers/handleApiError";
import { ReadChatOptions } from "@/modules/chat/types";

const closeChatMutation = async (options: ReadChatOptions): Promise<void> => {
    const headers = getAuthHeaders();

    const response = await fetch(url.chat.closeChat(options), {
        method: "PUT",
        headers,
    });

    if (!response.ok) {
        throw await handleApiError(response);
    }
};

export default closeChatMutation;
