import { url } from "@/api";
import handleApiError from "../../shared/helpers/handleApiError";
import { ResetPasswordPayload, User } from "../types";

export const resetPasswordMutation = async (payload: ResetPasswordPayload): Promise<User> => {
    try {
        const registerResponse = await fetch(url.users.resetPassword, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const newUser = await registerResponse.json();

        if (!registerResponse.ok) {
            handleApiError(newUser);
        }

        return newUser;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};