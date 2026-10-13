import React from "react";
import { Image, Text, View } from "react-native";
import { Article } from "@/modules/articles/types";

type Props = { article: Article };
const ArticleCard = ({ article }: Props) => {
    return (
        <View className="w-full bg-[#f4f5f7] rounded-xl overflow-hidden">
            <Image
                source={{ uri: article.banner_url }}
                className="w-full h-40 bg-slate-300"
                resizeMode="cover"
            />

            <View className="p-4 pt-3">
                <View className="bg-[#00c4a7] px-2 py-1 rounded self-start mb-2">
                    <Text className="text-white text-xs font-semibold">
                        {article.article_category.name}
                    </Text>
                </View>

                <Text
                    className="text-[20px] leading-6 font-bold text-[#142333] mb-1.5"
                    numberOfLines={2}
                >
                    {article.title}
                </Text>

                <Text
                    className="text-base text-slate-700 leading-5"
                    numberOfLines={2}
                >
                    {article.content}
                </Text>
            </View>
        </View>
    );
};
export default ArticleCard;
