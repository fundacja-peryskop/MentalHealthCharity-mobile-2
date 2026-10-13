import React from "react";
import { Pressable, Text } from "react-native";
import { Href } from "expo-router";
import { useTranslation } from "react-i18next";

type ButtonVariant = "primary" | "secondary" | "warning" | "error";
type ButtonWidth = "auto" | "full" | "half";

export interface IButtonProps {
    title: string;
    variant?: ButtonVariant;
    width?: ButtonWidth;
    onPress?: () => void | Href;
    disabled?: boolean;
}

export default function CustomButton({
    title,
    variant = "primary",
    width = "auto",
    onPress,
    disabled = false,
}: IButtonProps) {
    const { t } = useTranslation();
    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-primary active:bg-secondary",
        secondary: "bg-white active:bg-primary border border-primary",
        warning: "bg-warning active:bg-white border border-warning",
        error: "bg-error active:bg-white border border-error",
    };

    const widthStyles: Record<ButtonWidth, string> = {
        auto: "px-4",
        full: "w-full",
        half: "w-1/2",
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            className={`py-3 rounded-lg items-center justify-center ${variantStyles[variant]} ${widthStyles[width]} ${disabled ? "opacity-60" : ""}`}
        >
            <Text
                className={`text-center font-semibold ${
                    variant === "secondary" ||
                    variant === "warning" ||
                    variant === "error"
                        ? "text-primary"
                        : "text-white"
                }`}
            >
                {t(`${title}`)}
            </Text>
        </Pressable>
    );
}
