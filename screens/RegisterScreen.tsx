import React from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import RegisterForm from "@/modules/auth/components/RegisterForm";
import { RegisterPayload } from "@/modules/auth/types";
import { router } from "expo-router";
import { useToast } from "@/modules/shared/components/Toast";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Typography } from "@fundacja-peryskop/ui";

const RegisterScreen: React.FC = () => {
    const { t } = useTranslation();
    const { register } = useUser();
    const { showToast } = useToast();

    const handleSubmit = async (values: RegisterPayload) => {
        register.mutate(values, {
            onSuccess: () => {
                router.push("/email-confirmation");
                showToast({
                    type: "success",
                    title: t("common.success"),
                    description:
                        t("common.register_screen.register_success") +
                        " " +
                        t("common.register_screen.register_activation_note"),
                    duration: 400,
                });
            },
            onError: (error: unknown) => {
                const message =
                    error && typeof error === "object" && "message" in error
                        ? String(error.message)
                        : t("errors.unknown");
                showToast({
                    type: "error",
                    title: t("errors.fail"),
                    description: message,
                    duration: 4000,
                });
            },
        });
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
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

                    <RegisterForm onSubmit={handleSubmit} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
