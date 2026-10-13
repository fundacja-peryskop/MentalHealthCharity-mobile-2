import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import ResetPasswordSendEmail from "@/modules/auth/components/ResetPasswordSendEmailForm";
import { useToast } from "@/modules/shared/components/Toast";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordMutation } from "@/modules/auth/queries/resetPasswordSendEmailMutation";
import { router } from "expo-router";
import { Typography } from "@fundacja-peryskop/ui";

interface ResetPasswordEmailFormValues {
    email: string;
}

const ResetPasswordSendEmailScreen: React.FC = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { mutate } = useMutation({
        mutationFn: resetPasswordMutation,
        onSuccess() {
            showToast({ type: "success", title: t("common.success"), description: t("common.register_screen.register_success"), duration: 400 });
            router.replace("/sign-in");
        },
    });

    const handleSubmit = (values: ResetPasswordEmailFormValues) => {
        mutate(values);
    };
    return (
        <View className="flex-1 mt-11">
            <View className="gap-6 flex-1 px-6">
                <View className="gap-2">
                    <Typography variant="title2" className="font-extrabold">
                        {t("common.login_screen.header")}
                    </Typography>
                    <Typography variant="regularRegular">
                        {t("common.login_screen.description")}
                    </Typography>
                </View>

                <ResetPasswordSendEmail onSubmit={handleSubmit} />
            </View>
        </View>
    );
};

export default ResetPasswordSendEmailScreen;