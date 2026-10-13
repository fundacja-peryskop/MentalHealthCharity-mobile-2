import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
    Easing,
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface Props {
    progress: number;
    title: string;
    subtitle: string;
    stepIndicator?: string;
    children?: React.ReactNode;
    direction?: number;
    animationKey?: string | number;
}

const getEnteringAnimation = (direction: number, delay = 0) => {
    const animation = direction > 0 ? SlideInRight : SlideInLeft;

    return animation
        .duration(300)
        .delay(delay)
        .easing(Easing.inOut(Easing.ease));
};

const getExitingAnimation = (direction: number) => {
    const animation = direction < 0 ? SlideOutRight : SlideOutLeft;

    return animation.duration(300).easing(Easing.inOut(Easing.ease));
};

const clampProgress = (value: number) => {
    return Math.min(100, Math.max(0, value));
};

const FormWrapper = ({
    progress,
    subtitle,
    title,
    stepIndicator,
    children,
    direction = 1,
    animationKey,
}: Props) => {
    const progressValue = useSharedValue(clampProgress(progress));

    useEffect(() => {
        progressValue.value = withTiming(clampProgress(progress), {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        });
    }, [progress, progressValue]);

    const progressAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progressValue.value}%`,
        };
    });

    const currentAnimationKey = animationKey ?? title;

    return (
        <View className="bg-card w-full max-w-[560px] overflow-hidden rounded-2xl shadow-lg">
            {/* Progress line */}
            <View
                className="bg-muted/50 relative h-1 w-full overflow-hidden"
                accessible
                accessibilityRole="progressbar"
                accessibilityValue={{
                    min: 0,
                    max: 100,
                    now: clampProgress(progress),
                }}
            >
                <Animated.View
                    className="bg-primary-brand absolute bottom-0 left-0 top-0"
                    style={progressAnimatedStyle}
                />
            </View>

            <View className="flex flex-col px-6 pb-6 pt-8 md:px-10 md:pb-8 md:pt-10">
                {/* Step indicator pill */}
                {stepIndicator ? (
                    <View className="bg-primary-brand/10 mb-4 w-fit self-start rounded-full px-3 py-1">
                        <Text className="text-primary-brand text-xs font-semibold">
                            {stepIndicator}
                        </Text>
                    </View>
                ) : null}

                {/* Animated header */}
                <Animated.View
                    key={`${currentAnimationKey}-header`}
                    entering={getEnteringAnimation(direction)}
                    exiting={getExitingAnimation(direction)}
                    className="mb-8"
                >
                    <Text className="text-foreground text-2xl font-bold md:text-3xl">
                        {title}
                    </Text>

                    <Text className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                        {subtitle}
                    </Text>
                </Animated.View>

                {/* Animated content */}
                <Animated.View
                    key={`${currentAnimationKey}-content`}
                    entering={getEnteringAnimation(direction, 50)}
                    exiting={getExitingAnimation(direction)}
                >
                    {children}
                </Animated.View>
            </View>
        </View>
    );
};

export default FormWrapper;
