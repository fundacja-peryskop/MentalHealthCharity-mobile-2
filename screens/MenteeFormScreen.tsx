import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Href, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MenteeForm from "@/modules/forms/components/MenteeForm";
import sendFormMutation from "@/modules/forms/queries/sendFormMutation";
import { formTypes, MenteeFormPayload, MenteeFormValues } from "@/modules/forms/types";
import { useToast } from "@/modules/shared/components/Toast";
import { useTranslation } from "react-i18next";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import CustomButton from "@/modules/shared/components/Button";

const MenteeFormScreen = () => {
    const [step, setStep] = useState(0);
    const { showToast } = useToast();
    const { t } = useTranslation();
    const { logout } = useUser();
    const queryClient = useQueryClient();
    const sendForm = useMutation({
        mutationFn: sendFormMutation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["canUserSendForm"],
            });
            showToast({
                type: "success",
                title: t("form.mentee_form.submit_success_title"),
                description: t("form.mentee_form.submit_success_description"),
            });
            router.replace("/form-submission-success" as Href);
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

    const handleSubmit = (values: MenteeFormValues) => {
        if (!values.contact_preference) {
            showToast({
                type: "error",
                title: t("form.mentee_form.missing_preference_title"),
                description: t(
                    "form.mentee_form.missing_preference_description",
                ),
            });
            return;
        }
        const contacts = values.contacts.map((value) => ({
            name: value,
            value,
        }));

        const fields: MenteeFormPayload = {
            age: Number(values.age),
            name: values.name,
            description: values.description,
            contact_preference: values.contact_preference,
            email: values.email,
            source: values.source,
            tos: values.tos,
            contacts,
            ...(values.phone ? { phone: Number(values.phone) } : {}),
        };

        sendForm.mutate({
            fields,
            notes: {
                interview_description: "",
                work_area: "",
                availability: "",
            },
            form_type: formTypes.MENTEE,
        });
    };

    return (
        <View className="flex-1 bg-slate-50">
            <View className="flex-row items-center justify-between px-4 pt-6 pb-4">
                <View />
                <CustomButton
                    title="settings.logout"
                    variant="secondary"
                    width="auto"
                    onPress={() => void logout()}
                />
            </View>
            <View className="px-4 pt-4">
                <MenteeForm
                    isLoading={sendForm.isPending}
                    onSubmit={handleSubmit}
                    setStep={setStep}
                    step={step}
                />
            </View>
        </View>
    );
};

export default MenteeFormScreen;
