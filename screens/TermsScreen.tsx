import React from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useToast } from "@/modules/shared/components/Toast";

const TermsScreen = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const handleAccept = () => {
        showToast({
            type: "success",
            title: t("common.success"),
            description: t("terms.accepted"),
            duration: 3000,
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <View className="px-4 py-3 border-b border-slate-100 flex-row items-center">
                <Button
                    variant="secondary"
                    outlined
                    onPress={() => router.back()}
                    className="py-1 pr-4"
                >
                    <Text className="text-[#142333] font-semibold text-base">
                        {t("common_return")}
                    </Text>
                </Button>
            </View>

            <ScrollView
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-2xl font-bold text-[#142333] mb-6">
                    {t("terms.title")}
                </Text>

                <View className="prose prose-slate max-w-none">
                    <Text className="mb-4">{t("terms.intro")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section1_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section1_content")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section2_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section2_content")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section3_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section3_content")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section4_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section4_content")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section5_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section5_content")}</Text>

                    <Text className="font-bold text-lg mb-2">
                        {t("terms.section6_title")}
                    </Text>
                    <Text className="mb-4">{t("terms.section6_content")}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default TermsScreen;
