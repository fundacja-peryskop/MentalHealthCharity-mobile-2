import { RegisterPayload, RegisterResponse } from "@/modules/auth/types";
import handleApiError from "@/modules/shared/helpers/handleApiError";
import { url } from "@/api";

export const registerMutation = async (
    data: RegisterPayload,
): Promise<RegisterResponse> => {
    try {
        const payload: Record<string, string> = {
            email: data.email,
            password: data.password,
            full_name: data.full_name,
        };

        if (data.intent) {
            payload.intent = data.intent;
        }

        if (data.next) {
            payload.next = data.next;
        }

        const registerResponse = await fetch(url.users.createUserOpen, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const newUser = await registerResponse.json();

        if (!registerResponse.ok) {
            await handleApiError(newUser);
        }

        return newUser;
    } catch (err) {
        console.error("Error registering:", err);
        throw err;
    }
};
