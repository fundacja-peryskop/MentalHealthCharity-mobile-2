import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import React from "react";
import LoginForm from "@/modules/auth/components/LoginForm";
import { LoginFormValues } from "@/modules/auth/types";
import { useToast } from "@/modules/shared/components/Toast";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Typography } from "@fundacja-peryskop/ui";

const LoginScreen: React.FC = () => {
    const { t } = useTranslation();
    const { login } = useUser();
    const { showToast } = useToast();

    const handleSubmit = async (values: LoginFormValues) => {
        login.mutate(values, {
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
                <View className="gap-6 flex-1">
                    <View className="gap-2 px-6">
                        <Typography variant="title2" className="font-extrabold">
                            {t("common.login_screen.header")}
                        </Typography>
                        <Typography variant="regularRegular">
                            {t("common.login_screen.description")}
                        </Typography>
                    </View>

                    <LoginForm onSubmit={handleSubmit} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
