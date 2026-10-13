import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { MarkAsReadMutationOptions } from "../types";

export const markAsReadMutation = async (
    options: MarkAsReadMutationOptions,
) => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.chat.markAsRead(options), {
            method: "PUT",
            headers,
        });

        if (!res.ok) {
            throw await handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("Error while marking as read:", e);
        throw e;
    }
};
