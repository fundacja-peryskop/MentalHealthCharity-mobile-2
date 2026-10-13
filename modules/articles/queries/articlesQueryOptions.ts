import { queryOptions } from "@tanstack/react-query";
import { url } from "@/api";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { Article, SearchPublicArticlesOptions } from "../types";
import resolveBannerUrl from "../helpers/resolveBannerUrl";

const withResolvedBannerUrls = (article: Article): Article => ({
    ...article,
    banner_url: resolveBannerUrl(article.banner_url),
});

export const articlesQueryOptions = (options: SearchPublicArticlesOptions) =>
    queryOptions<Pagination<Article>>({
        queryKey: ["articles", options],
        queryFn: async () => {
            try {
                const response = await fetch(
                    url.articles.searchPublicArticles(options),
                );

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
    });
