import { queryOptions } from "@tanstack/react-query";
import { url } from "@/api";
import getAuthHeaders from "@/modules/auth/helpers/getAuthHeaders";
import handleApiError from "@/modules/shared/helpers/handleApiError";
import {
    CanUserSendFormOptions,
    CanUserSendFormResponse,
} from "@/modules/forms/types";

export const canUserSendFormQuery = (options?: CanUserSendFormOptions) =>
    queryOptions<CanUserSendFormResponse>({
        queryKey: ["canUserSendForm", options],
        queryFn: async () => {
            const headers = getAuthHeaders();
            const response = await fetch(url.form.canUserSendForm(options), {
                headers,
            });

            if (!response.ok) {
                throw await handleApiError(response);
            }

            return response.json();
        },
    });
