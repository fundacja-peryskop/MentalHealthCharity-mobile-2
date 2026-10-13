import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "@/api";
import { Article, ReadArticlesByUserOptions } from "../types";
import { Pagination } from "../../shared/types";
import handleApiError from "../../shared/helpers/handleApiError";
import resolveBannerUrl from "../helpers/resolveBannerUrl";

const withResolvedBannerUrls = (article: Article): Article => ({
    ...article,
    banner_url: resolveBannerUrl(article.banner_url),
});

export const articlesByUserQueryOptions = (
    options: ReadArticlesByUserOptions,
    additional?: Omit<UseQueryOptions<Pagination<Article>>, "queryFn">,
) => {
    return queryOptions<Pagination<Article>>({
        queryKey: ["articlesByUser", options],
        queryFn: async () => {
            try {
                const response = await fetch(url.articles.readByUser(options));

                const data = await response.json();

                if (!response.ok) {
                    await handleApiError(data);
                }

                const items = Array.isArray(data?.items)
                    ? data.items
                    : Array.isArray(data)
                      ? data
                      : [];

                return { ...data, items: items.map(withResolvedBannerUrls) };
            } catch (error) {
                console.error("Error fetching articles:", error);
                throw error;
            }
        },
        ...additional,
    });
};
