import { User } from "../types";
import * as SecureStore from "expo-secure-store";
import { ApiError } from "@/modules/shared/types";
import { url } from "@/api";

async function parseBody(response: Response) {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

const fetchUserDataQuery = async (): Promise<User> => {
    try {
        const [token, tokenType] = await Promise.all([
            SecureStore.getItemAsync("token"),
            SecureStore.getItemAsync("jwt_type"),
        ]);
        if (!token || !tokenType) {
            throw new ApiError("Missing token", 401);
        }

        console.log(url.users.readUsersMe);

        const response = await fetch(url.users.readUsersMe, {
            headers: {
                Authorization: `${tokenType} ${token}`,
            },
        });
        const data = await parseBody(response);
        console.log(data);

        if (!response.ok) {
            const message =
                data?.detail ?? data?.message ?? response.statusText;
            throw new ApiError(message, response.status, data);
        }

        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export default fetchUserDataQuery;
