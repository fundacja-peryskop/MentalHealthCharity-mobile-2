import { type ComponentProps, useEffect, useState } from "react";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
    palette,
    shadows,
    Stack,
    styled,
    Typography,
} from "@fundacja-peryskop/ui";

type IconName = ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
    name: string;
    labelKey: string;
    activeIcon: IconName;
    inactiveIcon: IconName;
    badge?: string | number | boolean;
};

const tabs: TabConfig[] = [
    {
        name: "index",
        labelKey: "navigation.home",
        activeIcon: "home",
        inactiveIcon: "home-outline",
    },
    {
        name: "chats",
        labelKey: "navigation.chats",
        activeIcon: "chatbubble",
        inactiveIcon: "chatbubble-outline",
        badge: "9+",
    },
    {
        name: "settings",
        labelKey: "navigation.options",
        activeIcon: "settings",
        inactiveIcon: "settings-outline",
        badge: true,
    },
];

const TabBarFrame = styled(Stack, {
    name: "TabBarFrame",
    paddingBottom: 5,
});

const TabBarCard = styled(Stack, {
    name: "TabBarCard",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "$skyLight",
    backgroundColor: "$background",
    paddingHorizontal: 8,
    paddingVertical: 8,
});

const TabBarItem = styled(Stack, {
    name: "TabBarItem",
    tag: "button",
    role: "button",
    cursor: "pointer",
    flex: 1,
    flexDirection: "row", // Ikona i tekst obok siebie dla aktywnego, lub kolumna dla nieaktywnego
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999, // Pigułka dla aktywnego tła
    hoverStyle: {
        opacity: 0.7,
    },
    pressStyle: {
        opacity: 0.6,
    },
    variants: {
        focused: {
            true: {
                backgroundColor: "$skyLight", // Jasnoniebieskie tło dla aktywnego
            },
        },
    },
});

// Wrapper na ikonę i badge, aby poprawnie pozycjonować kropkę
const IconWrapper = styled(Stack, {
    name: "IconWrapper",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
});

const Badge = styled(Stack, {
    name: "Badge",
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#FF3B30", // Czerwony kolor z obrazka
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "$background", // Obramowanie takie samo jak tło paska
});

const useIsKeyboardShown = () => {
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);

    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSubscription = Keyboard.addListener(showEvent, () =>
            setIsKeyboardShown(true),
        );
        const hideSubscription = Keyboard.addListener(hideEvent, () =>
            setIsKeyboardShown(false),
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return isKeyboardShown;
};

export default function AppTabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const isKeyboardShown = useIsKeyboardShown();

    if (isKeyboardShown) {
        return null;
    }

    return (
        <TabBarFrame>
            <TabBarCard style={{ ...shadows.medium }}>
                {tabs.map((tab) => {
                    const route = state.routes.find(
                        (item) =>
                            item.name === tab.name ||
                            item.name === `${tab.name}/index`,
                    );

                    if (!route) {
                        return null;
                    }

                    const isFocused =
                        state.routes[state.index]?.key === route.key;
                    const options = descriptors[route.key]?.options;
                    const label = options?.title ?? t(tab.labelKey);

                    const handlePress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const handleLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarItem
                            key={route.key}
                            focused={isFocused}
                            accessibilityRole="button"
                            accessibilityLabel={
                                options?.tabBarAccessibilityLabel ?? label
                            }
                            accessibilityState={
                                isFocused ? { selected: true } : {}
                            }
                            onPress={handlePress}
                            onLongPress={handleLongPress}
                        >
                            <IconWrapper>
                                <Ionicons
                                    name={
                                        isFocused
                                            ? tab.activeIcon
                                            : tab.inactiveIcon
                                    }
                                    size={24}
                                    color={
                                        isFocused
                                            ? palette.primary.base
                                            : palette.sky.dark
                                    }
                                />
                                {tab.badge && (
                                    <Badge>
                                        {tab.badge !== true && (
                                            <Typography
                                                variant="smallBold"
                                                color="white"
                                                fontSize={10}
                                            >
                                                {tab.badge}
                                            </Typography>
                                        )}
                                    </Badge>
                                )}
                            </IconWrapper>

                            <Typography
                                variant={
                                    isFocused ? "smallBold" : "smallRegular"
                                }
                                align="center"
                                color={
                                    isFocused
                                        ? palette.primary.base
                                        : palette.sky.dark
                                }
                                numberOfLines={1}
                            >
                                {label}
                            </Typography>
                        </TabBarItem>
                    );
                })}
            </TabBarCard>
        </TabBarFrame>
    );
}
