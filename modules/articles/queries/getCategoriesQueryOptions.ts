import { queryOptions } from "@tanstack/react-query";
import { url } from "@/api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ArticleCategory } from "../types";
import { Pagination } from "../../shared/types";

export const getCategoriesQueryOptions = () =>
    queryOptions<Pagination<ArticleCategory>>({
        queryKey: ["article_category"],
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.articleCategories.read, {
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    await handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching chat note:", error);
                throw error;
            }
        },
    });
