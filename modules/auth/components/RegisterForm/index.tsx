import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { RegisterFormValues } from "@/modules/auth/types";
import { router } from "expo-router";
import AuthScreenNavigation from "@/modules/auth/components/AuthScreenNavigation";
import { FormGroup, Input, Link, Typography } from "@fundacja-peryskop/ui";
import { Checkbox } from "@/modules/shared/components/Checkbox";
import PasswordInput from "@/modules/auth/components/PasswordInput";
import { ScrollView, View } from "react-native";

interface IRegisterFormProps {
    onSubmit: (values: RegisterFormValues) => void;
}

const RegisterForm = ({ onSubmit }: IRegisterFormProps) => {
    const { t } = useTranslation();

    const initialValues: RegisterFormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        policy_confirm: false,
        full_name: "",
    };

    const validationSchema = Yup.object({
        full_name: Yup.string().required(t("validation.required")),
        email: Yup.string()
            .email(t("validation.invalid_email"))
            .required(t("validation.required")),
        password: Yup.string()
            .min(8, t("validation.invalid_password"))
            .required(t("validation.required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], t("validation.passwords_mismatch"))
            .required(t("validation.required")),
        policy_confirm: Yup.boolean()
            .oneOf([true], t("validation.required"))
            .required(t("validation.required")),
    });

    return (
        <View className="flex-1">
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
                    setFieldValue,
                }) => (
                    <View className="flex flex-1 justify-between">
                        <ScrollView
                            className="flex-1"
                            contentContainerClassName="gap-4 pb-4"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <FormGroup className="gap-4">
                                <Input
                                    label={t("common.register_screen.username")}
                                    placeholder={t(
                                        "common.register_screen.username",
                                    )}
                                    value={values.full_name}
                                    onChangeText={handleChange("full_name")}
                                    onBlur={handleBlur("full_name")}
                                    error={
                                        touched.full_name && errors.full_name
                                            ? errors.full_name
                                            : undefined
                                    }
                                />

                                <Input
                                    label={t("common.register_screen.email")}
                                    placeholder={t(
                                        "common.register_screen.email",
                                    )}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    error={
                                        touched.email && errors.email
                                            ? errors.email
                                            : undefined
                                    }
                                />

                                <PasswordInput
                                    label={t("common.register_screen.password")}
                                    placeholder={t(
                                        "common.register_screen.password",
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

                                <PasswordInput
                                    label={t(
                                        "common.register_screen.confirm_password",
                                    )}
                                    placeholder={t(
                                        "common.register_screen.confirm_password",
                                    )}
                                    value={values.confirmPassword}
                                    onChangeText={handleChange(
                                        "confirmPassword",
                                    )}
                                    onBlur={handleBlur("confirmPassword")}
                                    error={
                                        touched.confirmPassword &&
                                        errors.confirmPassword
                                            ? errors.confirmPassword
                                            : undefined
                                    }
                                />

                                <View className="flex flex-row items-center gap-2 mt-2">
                                    <Checkbox
                                        checked={values.policy_confirm}
                                        onCheckedChange={(checked) =>
                                            setFieldValue(
                                                "policy_confirm",
                                                checked,
                                            )
                                        }
                                    />
                                    <Typography
                                        variant="smallRegular"
                                        className="text-slate-600"
                                    >
                                        {t("common.register_screen.policy")}
                                    </Typography>
                                </View>
                                {touched.policy_confirm &&
                                    errors.policy_confirm && (
                                        <Typography
                                            variant="smallRegular"
                                            className="text-red-500"
                                        >
                                            {errors.policy_confirm}
                                        </Typography>
                                    )}
                                <View className="flex flex-row mt-2">
                                    <Typography
                                        variant="smallRegular"
                                        className="text-slate-500"
                                    >
                                        {t(
                                            "common.register_screen.have_account",
                                        )}{" "}
                                    </Typography>
                                    <Link
                                        href="/sign-in"
                                        onPress={() => router.push("/sign-in")}
                                    >
                                        <Typography
                                            variant="smallSemibold"
                                            className="text-primary"
                                        >
                                            {t("common.register_screen.login")}
                                        </Typography>
                                    </Link>
                                </View>
                            </FormGroup>
                        </ScrollView>

                        <AuthScreenNavigation
                            submitTitle={t("common.register_screen.register")}
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

export default RegisterForm;
