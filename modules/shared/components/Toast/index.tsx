import React, { createContext, useCallback, useContext, useState } from "react";
import { View, Text, Animated } from "react-native";


type ToastType = "success" | "warning" | "error";

interface ToastOptions {
    type?: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [toast, setToast] = useState<ToastOptions | null>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    const showToast = useCallback((options: ToastOptions) => {
        setToast(options);
        setVisible(true);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }, options.duration ?? 3000);
    }, []);

    const getVariantStyles = () => {
        switch (toast?.type) {
            case "success":
                return "bg-green-200 border-green-500";
            case "warning":
                return "bg-orange-200 border-orange-500";
            case "error":
                return "bg-red-200 border-red-500";
            default:
                return "bg-green-200 border-green-500";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {visible && toast && (
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        position: "absolute",
                        bottom: 40,
                        left: 16,
                        right: 16,
                    }}
                >
                    <View
                        className={`rounded-2xl border-l-4 p-4 shadow-md ${getVariantStyles()} bg-white`}
                    >
                        <Text className="font-semibold text-base text-gray-900">
                            {toast.title}
                        </Text>

                        {toast.description && (
                            <Text className="text-sm text-gray-600 mt-1">
                                {toast.description}
                            </Text>
                        )}
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};