import { LoginAccessTokenResponse, LoginPayload } from "@/modules/auth/types";
import handleApiError from "@/modules/shared/helpers/handleApiError";
import { url } from "@/api";

export const loginMutation = async (
    data: LoginPayload,
): Promise<LoginAccessTokenResponse> => {
    try {
        const payload: Record<string, string> = {
            email: data.email,
            password: data.password,
        };
        console.log(payload);
        if (data.intent) {
            payload.intent = data.intent;
        }

        if (data.next) {
            payload.next = data.next;
        }
        const body = new URLSearchParams({
            username: data.email,
            password: data.password,
        }).toString();

        const loginResponse = await fetch(url.login.loginAccessToken, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        const user = await loginResponse.json();
        console.log(user);
        if (!loginResponse.ok) {
            await handleApiError(user);
        }
        return user;
    } catch (err) {
        throw err;
    }
};
