import {
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import {
    LoginAccessTokenResponse,
    LoginFormValues,
    RegisterPayload,
    RegisterResponse,
    User,
} from "@/modules/auth/types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { registerMutation } from "@/modules/auth/queries/registerMutation";
import { loginMutation } from "@/modules/auth/queries/tokenMutation";
import handleApiError from "@/modules/shared/helpers/handleApiError";
import Loader from "@/modules/shared/components/Loader";
import fetchUserDataQuery from "@/modules/auth/queries/fetchUserDataQuery";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface UserContextType {
    user: User | undefined;
    login: UseMutationResult<LoginAccessTokenResponse, Error, LoginFormValues>;
    isLoading: boolean;
    error: Error | null;
    register: UseMutationResult<RegisterResponse, Error, RegisterPayload>;
    logout: () => Promise<void>;
    isFetchingUser: boolean;
}

interface Props {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<Props> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await SecureStore.getItemAsync("token");
                setIsAuthenticated(Boolean(token));
            } catch (error) {
                setIsAuthenticated(false);
                await handleApiError(
                    error instanceof Error
                        ? error
                        : new Error(t("session.restore_error")),
                );
            }
        };

        void restoreSession();
    }, [t]);

    const register = useMutation({
        mutationFn: registerMutation,
    });

    const login = useMutation({
        mutationFn: loginMutation,
        onSuccess: async (data) => {
            await Promise.all([
                SecureStore.setItemAsync("token", data.access_token),
                SecureStore.setItemAsync("jwt_type", data.token_type),
            ]);

            setIsAuthenticated(true);
        },
    });

    const endSession = async () => {
        await Promise.all([
            SecureStore.deleteItemAsync("token"),
            SecureStore.deleteItemAsync("jwt_type"),
        ]);

        queryClient.removeQueries({
            queryKey: ["userData"],
        });

        setIsAuthenticated(false);
    };

    const logout = async () => {
        await endSession();
        router.replace("/");
    };
    const {
        data: user,
        isLoading,
        isFetching,
        error,
    } = useQuery<User, Error>({
        queryKey: ["userData"],
        queryFn: fetchUserDataQuery,
        enabled: isAuthenticated === true,
        retry: false,
    });

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                isLoading,
                error,
                logout,
                register,
                isFetchingUser: isFetching,
            }}
        >
            {children}
            {isLoading && (
                <Loader text={t("session.logging_in")} variant="fullscreen" />
            )}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserContextProvider");
    }

    return context;
};
