import { ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface IProps {
    children: React.ReactNode;
}

export default function AppBackground({ children }: IProps) {
    return (
        <ImageBackground
            source={require("../../../../assets/images/Group 69.png")}
            className="flex-1 w-full"
            resizeMode="cover"
        >
            <SafeAreaView className="flex-1 ">{children}</SafeAreaView>
        </ImageBackground>
    );
}
