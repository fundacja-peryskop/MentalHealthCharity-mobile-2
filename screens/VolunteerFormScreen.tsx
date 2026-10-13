import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Href, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import VolunteerForm from "@/modules/forms/components/VolunteerForm";
import sendFormMutation from "@/modules/forms/queries/sendFormMutation";
import { formTypes, VolunteerFormValues } from "@/modules/forms/types";
import { useToast } from "@/modules/shared/components/Toast";
import { useTranslation } from "react-i18next";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import CustomButton from "@/modules/shared/components/Button";

const VolunteerFormScreen = () => {
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
                title: t("form.volunteer_form.submit_success_title"),
                description: t(
                    "form.volunteer_form.submit_success_description",
                ),
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

    const handleSubmit = (values: VolunteerFormValues) => {
        sendForm.mutate({
            fields: {
                age: values.age,
                phone: values.phone,
                tos: values.tos,
                education: values.education,
                description: values.description,
                interview_meeting_dates: values.interview_meeting_dates,
                source: values.source,
                did_help: values.did_help,
                contacts: values.contacts.map((value) => ({
                    name: value,
                    value,
                })),
                themes: values.themes.map((value) => ({
                    name: value,
                    value,
                })),
            },
            form_type: formTypes.VOLUNTEER,
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
                <VolunteerForm
                    isLoading={sendForm.isPending}
                    onSubmit={handleSubmit}
                    setStep={setStep}
                    step={step}
                />
            </View>
        </View>
    );
};

export default VolunteerFormScreen;
