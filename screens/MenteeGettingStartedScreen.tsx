import { useEffect } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { Href, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    Link,
    palette,
    Stack,
    styled,
    Typography,
} from "@fundacja-peryskop/ui";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { canUserSendFormQuery } from "@/modules/forms/queries/canUserSendFormQuery";
import { formTypes } from "@/modules/forms/types";
import { Roles } from "@/modules/users/constants";

const Banner = styled(Stack, {
    name: "MenteeGettingStartedBanner",
    backgroundColor: palette.primary.dark,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
});

const Content = styled(Stack, {
    name: "MenteeGettingStartedContent",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 16,
});

const CardContent = styled(Stack, {
    name: "MenteeGettingStartedCardContent",
    width: "100%",
    gap: 12,
});

const MenteeGettingStartedScreen = () => {
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

        if (hasCompletedForm) {
            router.replace("/(app)/(tabs)/chats" as Href);
        }
    }, [isLoading, user, hasCompletedForm]);

    const handleStart = () => {
        router.push("/pick-role");
    };

    const handleLogout = () => {
        void logout();
    };

    if (isLoading || !user) {
        return (
            <Stack
                flex={1}
                alignItems="center"
                justifyContent="center"
                padding={24}
                gap={16}
                backgroundColor={palette.sky.lightest}
            >
                <ActivityIndicator size="large" color={palette.primary.base} />
                <Typography variant="regularRegular" align="center" muted>
                    {t("pick_role.loading")}
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack flex={1}>
            <Banner>
                <Stack
                    flexDirection="row"
                    justifyContent="flex-end"
                    width="100%"
                >
                    <Link href="/sign-in" onPress={handleLogout}>
                        <Typography
                            variant="smallSemibold"
                            className="text-white"
                        >
                            {t("getting_started.logout")}
                        </Typography>
                    </Link>
                </Stack>

                <Stack alignItems="center" gap={8} paddingHorizontal={8}>
                    <Typography
                        variant="title2"
                        align="center"
                        className="text-white"
                    >
                        {t("getting_started.title")}
                    </Typography>
                    <Typography
                        variant="regularRegular"
                        align="center"
                        className="text-white"
                    >
                        {t("getting_started.subtitle")}
                    </Typography>
                </Stack>
            </Banner>
            <Content>
                <Card
                    variant="elevated"
                    width="100%"
                    maxWidth={520}
                    padding={24}
                    gap={20}
                >
                    <CardContent gap={12}>
                        <Typography variant="largeBold">
                            {t("getting_started.headline")}
                        </Typography>
                        <ScrollView
                            className="flex-1"
                            contentContainerStyle={{ paddingBottom: 32 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <Typography variant="smallRegular" muted>
                                {t("getting_started.card_intro")}
                            </Typography>
                        </ScrollView>
                    </CardContent>

                    <CardContent gap={8}>
                        <Typography variant="regularBold">
                            {t("getting_started.section_title")}
                        </Typography>
                        <Typography variant="smallRegular" muted>
                            {t("getting_started.paragraph_1")}
                        </Typography>
                        <Typography variant="smallRegular" muted>
                            {t("getting_started.paragraph_2")}
                        </Typography>
                    </CardContent>

                    <Card.Footer width="100%">
                        <Button
                            variant="primary"
                            fullWidth
                            onPress={handleStart}
                        >
                            {t("getting_started.cta")}
                        </Button>
                    </Card.Footer>
                </Card>

                <Typography variant="smallRegular" align="center" muted>
                    {t("getting_started.footer")}
                </Typography>
            </Content>
        </Stack>
    );
};

export default MenteeGettingStartedScreen;
