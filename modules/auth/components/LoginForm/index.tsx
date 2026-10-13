import { router } from "expo-router";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { LoginPayload } from "../../types";
import { FormGroup, Input, Link, Typography } from "@fundacja-peryskop/ui";
import { ScrollView, View } from "react-native";
import AuthScreenNavigation from "@/modules/auth/components/AuthScreenNavigation";
import PasswordInput from "@/modules/auth/components/PasswordInput";

interface ILoginFormProps {
    onSubmit: (values: LoginPayload) => void;
}

const LoginForm = ({ onSubmit }: ILoginFormProps) => {
    const { t } = useTranslation();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t("validation.invalid_email"))
            .required(t("validation.required")),
        password: Yup.string()
            .min(8, t("validation.invalid_password"))
            .required(t("validation.required")),
    });

    return (
        <View className="flex-1 ">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <View className="flex-1 flex-col justify-between">
                        <ScrollView
                            className="flex-1 px-6"
                            contentContainerClassName="gap-4 pb-4"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <FormGroup className="gap-4">
                                <Input
                                    label={t("common.login_screen.email")}
                                    placeholder={t("common.login_screen.email")}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    error={
                                        touched.email && errors.email
                                            ? errors.email
                                            : undefined
                                    }
                                />
                                <PasswordInput
                                    label={t("common.login_screen.password")}
                                    placeholder={t(
                                        "common.login_screen.password",
                                    )}
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    error={
                                        touched.password && errors.password
                                            ? errors.password
                                            : undefined
                                    }
                                />
                            </FormGroup>

                            <View className="flex flex-row justify-between items-center">
                                <Link
                                    href="/reset-password"
                                    onPress={() =>
                                        router.push("/reset-password")
                                    }
                                >
                                    <Typography
                                        variant="smallRegular"
                                        className="text-primary border-b border-primary"
                                    >
                                        {t(
                                            "common.login_screen.forgot_password",
                                        )}
                                    </Typography>
                                </Link>

                                <View className="flex-row items-center gap-1">
                                    <Typography
                                        variant="smallRegular"
                                        className="text-slate-500"
                                    >
                                        {t("common.login_screen.no_account")}
                                    </Typography>
                                    <Link
                                        href="/sign-up"
                                        onPress={() => router.push("/sign-up")}
                                    >
                                        <Typography
                                            variant="smallSemibold"
                                            className="text-primary"
                                        >
                                            {t(
                                                "common.register_screen.register",
                                            )}
                                        </Typography>
                                    </Link>
                                </View>
                            </View>
                        </ScrollView>

                        <AuthScreenNavigation
                            submitTitle={t("common.login_screen.login")}
                            onSubmit={handleSubmit}
                            cancelTitle={t("common.login_screen.return")}
                            onReturn={() => {
                                router.navigate("/welcome-screen");
                            }}
                        />
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default LoginForm;
