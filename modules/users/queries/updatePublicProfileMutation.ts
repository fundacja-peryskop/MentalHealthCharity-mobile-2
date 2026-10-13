import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { PublicProfile, UpdatePublicProfilePayload } from "../types";

const updatePublicProfileMutation = async (
    payload: UpdatePublicProfilePayload,
): Promise<PublicProfile> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(
            url.users.updatePublicProfile({ id: payload.user_id }),
            {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    avatar_url: payload.avatar_url,
                    description: payload.description,
                }),
            },
        );

        if (!res.ok) {
            throw await handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating public profile:", e);
        throw e;
    }
};

export default updatePublicProfileMutation;
