import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { PublicProfile, UpdateAvatarPayload } from "../types";

const updateAvatarMutation = async (
    payload: UpdateAvatarPayload,
): Promise<PublicProfile> => {
    const headers = getAuthHeaders({ withContentType: false });

    try {
        const formData = new FormData();
        formData.append("avatar", {
            uri: payload.avatar.uri,
            name: payload.avatar.name,
            type: payload.avatar.type,
        } as unknown as Blob);

        const res = await fetch(
            url.users.updateUserAvatar({ id: payload.user_id }),
            {
                method: "PUT",
                headers,
                body: formData,
            },
        );

        if (!res.ok) {
            throw await handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating avatar:", e);
        throw e;
    }
};

export default updateAvatarMutation;
