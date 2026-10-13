import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Href, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { canUserSendFormQuery } from "@/modules/forms/queries/canUserSendFormQuery";
import { formTypes } from "@/modules/forms/types";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { Roles } from "@/modules/users/constants";

const PickRoleScreen = () => {
    const { t } = useTranslation();
    const { user, isFetchingUser } = useUser();
    const isRoleUser = user?.user_role === Roles.USER;

    const menteeAvailability = useQuery({
        ...canUserSendFormQuery({ form_type: formTypes.MENTEE }),
        enabled: isRoleUser,
    });

    const volunteerAvailability = useQuery({
        ...canUserSendFormQuery({ form_type: formTypes.VOLUNTEER }),
        enabled: isRoleUser,
    });

    const canSendMentee = menteeAvailability.data?.can_send_form ?? false;
    const canSendVolunteer = volunteerAvailability.data?.can_send_form ?? false;
    const isLoading =
        isFetchingUser ||
        (isRoleUser &&
            (menteeAvailability.isLoading || volunteerAvailability.isLoading));
    const shouldShowPicker = isRoleUser && (canSendMentee || canSendVolunteer);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!shouldShowPicker) {
            router.replace("/(app)/(tabs)/chats" as Href);
        }
    }, [isLoading, shouldShowPicker]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                <ActivityIndicator size="large" color="#06B7A7" />
                <Text className="mt-4 text-center text-base text-slate-600">
                    {t("pick_role.loading")}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 px-4 pt-12">
            <View className="gap-2">
                <Text className="text-2xl font-bold text-slate-950">
                    {t("pick_role.title")}
                </Text>
                <Text className="text-base leading-6 text-slate-600">
                    {t("pick_role.subtitle")}
                </Text>
            </View>

            <View className="mt-8 gap-4">
                {canSendMentee ? (
                    <Pressable
                        onPress={() =>
                            router.push("/(app)/mentee-form" as Href)
                        }
                        className="flex-row items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 active:border-primary active:bg-primary/5"
                    >
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <Ionicons
                                name="heart-outline"
                                size={28}
                                color="#06B7A7"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-slate-950">
                                {t("pick_role.mentee_title")}
                            </Text>
                            <Text className="mt-1 text-sm leading-5 text-slate-600">
                                {t("pick_role.mentee_subtitle")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#94A3B8"
                        />
                    </Pressable>
                ) : null}

                {canSendVolunteer ? (
                    <Pressable
                        onPress={() =>
                            router.push("/(app)/volunteer-form" as Href)
                        }
                        className="flex-row items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 active:border-primary active:bg-primary/5"
                    >
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <Ionicons
                                name="people-outline"
                                size={28}
                                color="#06B7A7"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-slate-950">
                                {t("pick_role.volunteer_title")}
                            </Text>
                            <Text className="mt-1 text-sm leading-5 text-slate-600">
                                {t("pick_role.volunteer_subtitle")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#94A3B8"
                        />
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
};

export default PickRoleScreen;
