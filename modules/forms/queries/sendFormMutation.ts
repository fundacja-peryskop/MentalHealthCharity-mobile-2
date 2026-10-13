import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import Errors from "../../shared/constants";
import { ErrorMessage } from "../../shared/types";
import { Form, MenteeForm, MenteeFormPayload, VolunteerForm } from "../types";

const extractServerMessage = (body: string): string | undefined => {
    try {
        const data = JSON.parse(body) as { detail?: unknown };

        if (typeof data.detail === "string") {
            return data.detail;
        }

        if (Array.isArray(data.detail)) {
            const first = data.detail.find(
                (item) =>
                    item &&
                    typeof item === "object" &&
                    "msg" in item &&
                    typeof item.msg === "string",
            );

            if (first && "msg" in first) {
                return String(first.msg);
            }
        }
    } catch {
        return undefined;
    }

    return undefined;
};

const sendFormMutation = async (
    payload: Form<MenteeFormPayload | VolunteerForm>,
): Promise<Form<MenteeForm | VolunteerForm> | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.form.create, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const rawBody = await res.text();

            console.warn(
                "Form submit failed:",
                res.status,
                res.statusText,
                rawBody,
            );

            throw new Error(
                extractServerMessage(rawBody) ?? Errors[ErrorMessage.UNKNOWN],
            );
        }

        return await res.json();
    } catch (e) {
        console.error("While sending form:", e);
        throw e;
    }
};

export default sendFormMutation;
