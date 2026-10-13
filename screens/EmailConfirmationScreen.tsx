import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Link, Typography, palette } from "@fundacja-peryskop/ui";

const EmailConfirmationScreen: React.FC = () => {
    const { t } = useTranslation();

    const handleGoToLogin = () => {
        router.push("/sign-in");
    };

    return (
        <View className="flex-1 items-center justify-center px-6 pb-8">
            <View className="items-center gap-6">
                <MaterialCommunityIcons
                    name="email-open-outline"
                    size={80}
                    color={palette.primary.base}
                />

                <Typography
                    variant="title2"
                    align="center"
                    className="font-extrabold"
                >
                    {t("common.email_confirmation_screen.title")}
                </Typography>

                <Typography
                    variant="smallRegular"
                    align="center"
                    muted
                    className="px-2"
                >
                    {t("common.email_confirmation_screen.description")}
                </Typography>
            </View>

            <View className="mt-10 items-center gap-2">
                <Typography variant="smallRegular" align="center" muted>
                    {t("common.email_confirmation_screen.footer")}
                </Typography>

                <Link href="/sign-in" onPress={handleGoToLogin}>
                    <Typography
                        variant="smallSemibold"
                        align="center"
                        className="text-primary border-b border-primary"
                    >
                        {t(
                            "common.email_confirmation_screen.change_email_or_login",
                        )}
                    </Typography>
                </Link>
            </View>
        </View>
    );
};

export default EmailConfirmationScreen;
