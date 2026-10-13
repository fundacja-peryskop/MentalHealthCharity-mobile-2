import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { Chat, SearchChatQueryOptions } from "../types";

const getChatsMutation = async (
    options: SearchChatQueryOptions,
): Promise<Pagination<Chat>> => {
    try {
        const headers = getAuthHeaders();

        const res = await fetch(url.chat.readChats(options), {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            throw await handleApiError(res);
        }

        return await res.json();
    } catch (error) {
        throw await handleApiError(error);
    }
};

export default getChatsMutation;
