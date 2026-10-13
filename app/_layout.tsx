import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PeryskopProvider } from "@fundacja-peryskop/ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { ToastProvider } from "@/modules/shared/components/Toast";
import {
    UserContextProvider,
    useUser,
} from "@/modules/auth/components/AuthContextProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import AppBackground from "@/modules/shared/components/App-Background";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Sarabun: require("../assets/fonts/Sarabun-Regular.ttf"),
        "Sarabun-Medium": require("../assets/fonts/Sarabun-Medium.ttf"),
        "Sarabun-Bold": require("../assets/fonts/Sarabun-Bold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <PeryskopProvider defaultTheme="light">
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                    <QueryClientProvider client={queryClient}>
                        <ToastProvider>
                            <UserContextProvider>
                                <RootNavigator />
                            </UserContextProvider>
                        </ToastProvider>
                    </QueryClientProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </PeryskopProvider>
    );
}

function RootNavigator() {
    const { user, isLoading } = useUser();
    if (isLoading) {
        return null;
    }

    return (
        <AppBackground>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={!user}>
                    <Stack.Screen name="welcome-screen" />
                </Stack.Protected>

                <Stack.Protected guard={Boolean(user)}>
                    <Stack.Screen name="(app)" />
                </Stack.Protected>
            </Stack>
        </AppBackground>
    );
}
