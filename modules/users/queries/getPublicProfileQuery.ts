import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";
import { PublicProfile } from "../types";

const getPublicProfileQuery = async (
    userId: number,
): Promise<PublicProfile> => {
    try {
        const response = await fetch(
            url.users.readPublicProfile({ id: userId }),
        );

        const data = await response.json();

        if (!response.ok) {
            throw await handleApiError(data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching public profile:", error);
        throw error;
    }
};

export default getPublicProfileQuery;
