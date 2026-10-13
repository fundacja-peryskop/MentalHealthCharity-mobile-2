import { Tabs } from "expo-router/js-tabs";
import { useTranslation } from "react-i18next";
import AppTabBar from "@/modules/shared/components/AppNavigationTabBar";

export default function TabLayout() {
    const { t } = useTranslation();

    return (
        <Tabs
            tabBar={(props) => <AppTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="chats"
                options={{ title: t("navigation.chats") }}
            />
            <Tabs.Screen
                name="index"
                options={{ title: t("navigation.home") }}
            />
            <Tabs.Screen
                name="settings"
                options={{ title: t("navigation.options") }}
            />
        </Tabs>
    );
}
