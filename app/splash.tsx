import { SplashScreen } from "expo-router";
import { useUser } from "@/modules/auth/components/AuthContextProvider";

function SplashScreenController() {
    const { isLoading } = useUser();

    if (!isLoading) {
        SplashScreen.hideAsync();
    }

    return null;
}

export default SplashScreenController;
