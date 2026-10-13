import React from 'react';
import { View, Image, ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Props extends ViewProps {
    variant?: 'small' | 'fullscreen';
    text?: string;
    size?: number;
}

const Loader: React.FC<Props> = ({
                                     variant = 'small',
                                     text,
                                     size = 60,
                                     style,
                                     ...props
                                 }) => {
    const theme = useTheme();
    const loading_icon = require('../../../../assets/images/loading.svg');

    if (variant === 'fullscreen') {
        return (
            <View
                className="absolute inset-0 w-screen h-screen flex justify-center items-center z-10"
                style={[{ backgroundColor: theme.colors.background }, style]}
                {...props}
            >
                <View className="flex flex-col items-center gap-5">
                    <Image
                        source={loading_icon}
                        className="w-[60px] h-[60px]"
                        resizeMode="contain"
                    />
                    {text && (
                        <Text
                            variant="titleLarge"
                            className="text-center text-[20px]"
                        >
                            {text}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    if (variant === 'small') {
        return (
            <View
                className="self-center"
                style={[{ height: size, width: size }, style]}
                {...props}
            >
                <Image
                    source={loading_icon}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>
        );
    }

    return null;
};

export default Loader;