import { Formik } from "formik";
import * as Yup from "yup";
import { View } from "react-native";
import { router } from "expo-router";
import AuthScreenNavigation from "@/modules/auth/components/AuthScreenNavigation";
import { useTranslation } from "react-i18next";
import { Input, FormGroup, Typography, Link } from "@fundacja-peryskop/ui";

interface ResetPasswordEmailFormValues {
    email: string;
}

interface IResetPasswordEmailProps {
    onSubmit: (values: ResetPasswordEmailFormValues) => void;
}

const ResetPasswordSendEmail = ({ onSubmit }: IResetPasswordEmailProps) => {
    const { t } = useTranslation();

    const initialValues: ResetPasswordEmailFormValues = {
        email: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t("validation.invalid_email")).required(t("validation.required")),
    });

    return (
        <View className="flex-1">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View className="flex flex-1 justify-between">
                        <View className="gap-4 bg-[#f7f9fa] flex-1">
                            <FormGroup className="gap-4">
                                <Input
                                    label={t("common.register_screen.email")}
                                    placeholder={t("common.register_screen.email")}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    error={touched.email && errors.email ? errors.email : undefined}
                                />
                            </FormGroup>
                        </View>
                        <AuthScreenNavigation
                            submitTitle={t("common.reset_password.send_email")}
                            onSubmit={handleSubmit}
                            cancelTitle={t("common.login_screen.return")}
                            onReturn={() => {
                                router.navigate("/sign-in");
                            }}
                        />
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default ResetPasswordSendEmail;