import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { DeleteMessageOptions } from "../types";

const deleteChatMessageMutation = async (
    payload: DeleteMessageOptions,
): Promise<void> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.chat.deleteMessage(payload), {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            throw await handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("Error deleting chat message:", e);
        throw e;
    }
};

export default deleteChatMessageMutation;
