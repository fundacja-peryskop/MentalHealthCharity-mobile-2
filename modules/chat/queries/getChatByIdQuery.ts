import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { Chat, ReadChatOptions } from "../types";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";

export const getChatById = (options: ReadChatOptions) =>
    queryOptions<Chat>({
        queryKey: ["chat", options],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.chat.readChat(options), {
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw await handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching chat:", error);
                throw error;
            }
        },
        enabled: !!options.id && Number(options.id) > 0,
    });
