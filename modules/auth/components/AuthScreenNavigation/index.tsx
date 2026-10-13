import { ReactNode } from "react";
import { ImageBackground } from "react-native";
import { Button } from "@fundacja-peryskop/ui";
// @ts-ignore
import backgroundImage from "../../../../assets/images/Group68.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IAuthScreenNavigation {
    submitTitle: string;
    onSubmit: () => void;
    cancelTitle: string;
    onReturn: () => void;
}

export default function AuthScreenNavigation({
    submitTitle,
    onSubmit,
    cancelTitle,
    onReturn,
}: IAuthScreenNavigation): ReactNode {
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground
            resizeMode="cover"
            style={{
                paddingBottom: insets.bottom,
                paddingTop: 60,
                width: "100%",
            }}
            className="gap-3"
            source={backgroundImage}
        >
            <Button
                variant="primary"
                fullWidth
                onPress={onSubmit}
                className={"px-6"}
            >
                {submitTitle}
            </Button>
            <Button variant="primary" outlined fullWidth onPress={onReturn}>
                {cancelTitle}
            </Button>
        </ImageBackground>
    );
}
