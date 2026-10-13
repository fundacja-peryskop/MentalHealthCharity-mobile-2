import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "@/api";
import { Article, ReadArticleOptions } from "../types";
import handleApiError from "../../shared/helpers/handleApiError";
import resolveBannerUrl from "../helpers/resolveBannerUrl";

export const getArticleByIdQueryOptions = (
    options: ReadArticleOptions,
    additional: Omit<UseQueryOptions<Article>, "queryKey" | "queryFn"> = {},
) =>
    queryOptions<Article>({
        queryKey: ["article", options],
        ...additional,
        queryFn: async () => {
            try {
                const response = await fetch(url.articles.readById(options));

                const data: Article = await response.json();

                if (!response.ok) {
                    await handleApiError(data);
                }

                const transformedData: Article = {
                    ...data,
                    banner_url: resolveBannerUrl(data.banner_url),
                };

                return transformedData;
            } catch (error) {
                console.error("Error fetching article:", error);
                throw error;
            }
        },
    });
