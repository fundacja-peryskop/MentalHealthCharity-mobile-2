import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import AppBackground from "@/modules/shared/components/App-Background";

export default function Index() {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <AppBackground>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" />
                </View>
            </AppBackground>
        );
    }

    if (user) {
        return <Redirect href="/" />;
    }

    return <Redirect href="/welcome-screen" />;
}
