import { url } from "@/api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ArticleCategoryOptions } from "../types";

const deleteArticleCategoryMutation = async (
    options: ArticleCategoryOptions,
): Promise<void> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articleCategories.delete(options), {
            method: "DELETE",
            headers,
        });

        if (!res.ok) {
            await handleApiError(res);
        }
    } catch (e) {
        console.error("While deleting article category:", e);
        throw e;
    }
};

export default deleteArticleCategoryMutation;
