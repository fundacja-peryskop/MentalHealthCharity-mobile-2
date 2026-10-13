import { ComponentProps, useEffect } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Button,
    Link,
    palette,
    shadows,
    Stack,
    styled,
    Typography,
} from "@fundacja-peryskop/ui";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { canUserSendFormQuery } from "@/modules/forms/queries/canUserSendFormQuery";
import { formTypes } from "@/modules/forms/types";
import { Roles } from "@/modules/users/constants";

type IconName = ComponentProps<typeof Ionicons>["name"];

const Screen = styled(Stack, {
    name: "FormSubmissionSuccessScreen",
    flex: 1,
    backgroundColor: "$background",
});

const Content = styled(Stack, {
    name: "FormSubmissionSuccessContent",
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
});

/** Main surface - thin teal accent along the top edge. */
const Panel = styled(Stack, {
    name: "FormSubmissionSuccessPanel",
    width: "100%",
    gap: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "$backgroundStrong",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "$borderColor",
    borderTopWidth: 2,
    borderTopColor: "$primary",
    ...shadows.medium,
});

const IconCircle = styled(Stack, {
    name: "FormSubmissionSuccessIconCircle",
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "$primary",
    backgroundColor: "$primarySoft",
});

const InfoBlock = styled(Stack, {
    name: "FormSubmissionSuccessInfoBlock",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "$background",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "$borderColor",
});

const InfoIconCircle = styled(Stack, {
    name: "FormSubmissionSuccessInfoIconCircle",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$primarySoft",
});

const InfoBlockBody = styled(Stack, {
    name: "FormSubmissionSuccessInfoBlockBody",
    flex: 1,
    gap: 4,
});

const InfoRow = ({
    icon,
    iconColor,
    title,
    body,
}: {
    icon: IconName;
    iconColor: string;
    title: string;
    body: string;
}) => (
    <InfoBlock>
        <InfoIconCircle>
            <Ionicons name={icon} size={20} color={iconColor} />
        </InfoIconCircle>
        <InfoBlockBody>
            <Typography variant="regularBold">{title}</Typography>
            <Typography variant="smallRegular" muted>
                {body}
            </Typography>
        </InfoBlockBody>
    </InfoBlock>
);

const FormSubmissionSuccessScreen = () => {
    const { t } = useTranslation();
    const { user, isLoading: isUserLoading, logout } = useUser();
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
    const hasCompletedForm = !canSendMentee && !canSendVolunteer;

    const isCheckingForm =
        isRoleUser &&
        (menteeAvailability.isLoading || volunteerAvailability.isLoading);
    const isLoading = isUserLoading || isCheckingForm;

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!user) {
            router.replace("/welcome-screen");
            return;
        }

        // This screen confirms an already submitted form. If the form is
        // still sendable, the user never submitted it - send them back.
        if (!hasCompletedForm) {
            router.replace("/(app)/mentee-getting-started" as Href);
        }
    }, [isLoading, user, hasCompletedForm]);

    const handleGoHome = () => {
        router.replace("/(app)/(tabs)" as Href);
    };

    const handleLogout = () => {
        void logout();
    };

    if (isLoading || !user) {
        return (
            <Screen
                alignItems="center"
                justifyContent="center"
                padding={24}
                gap={16}
            >
                <ActivityIndicator size="large" color={palette.primary.base} />
                <Typography variant="regularRegular" align="center" muted>
                    {t("form_submission_success.loading")}
                </Typography>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Content>
                    <Panel>
                        <Stack
                            alignItems="center"
                            gap={12}
                            paddingHorizontal={8}
                        >
                            <IconCircle>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={36}
                                    color={palette.primary.base}
                                />
                            </IconCircle>

                            <Typography variant="title3" align="center">
                                {t("form_submission_success.title")}
                            </Typography>

                            <Typography
                                variant="regularRegular"
                                align="center"
                                muted
                            >
                                {t("form_submission_success.subtitle")}
                            </Typography>
                        </Stack>

                        <Stack width="100%" gap={12}>
                            <InfoRow
                                icon="business-outline"
                                iconColor={palette.primary.base}
                                title={t("form_submission_success.next_title")}
                                body={t("form_submission_success.next_body")}
                            />
                            <InfoRow
                                icon="mail-outline"
                                iconColor={palette.primary.base}
                                title={t("form_submission_success.inbox_title")}
                                body={t("form_submission_success.inbox_body")}
                            />
                            <InfoRow
                                icon="time-outline"
                                iconColor={palette.primary.base}
                                title={t(
                                    "form_submission_success.timing_title",
                                )}
                                body={t("form_submission_success.timing_body")}
                            />
                        </Stack>

                        <Typography variant="regularBold" align="center">
                            {t("form_submission_success.footer")}
                        </Typography>

                        <Button
                            variant="primary"
                            fullWidth
                            onPress={handleGoHome}
                        >
                            <Ionicons
                                name="home-outline"
                                size={18}
                                color={palette.common.white}
                            />
                            <Typography
                                variant="regularSemibold"
                                color={palette.common.white}
                            >
                                {t("form_submission_success.cta")}
                            </Typography>
                        </Button>
                    </Panel>

                    <Stack width="100%" alignItems="center">
                        <Link href="/sign-in" onPress={handleLogout}>
                            <Typography variant="smallSemibold" muted>
                                {t("form_submission_success.logout")}
                            </Typography>
                        </Link>
                    </Stack>
                </Content>
            </ScrollView>
        </Screen>
    );
};

export default FormSubmissionSuccessScreen;
