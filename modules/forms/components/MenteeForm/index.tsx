import {
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { MenteeFormValues } from "@/modules/forms/types";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useUser } from "@/modules/auth/components/AuthContextProvider";
import { validation } from "@/modules/shared/constants";
import { useFormik } from "formik";

interface Props {
    onSubmit: (values: MenteeFormValues) => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    isLoading?: boolean;
}

const contactOptions = [
    { value: "email", labelKey: "form.mentee_form.contact.email" },
    { value: "phone", labelKey: "form.mentee_form.contact.phone" },
];

const referralSourceOptions = [
    { value: "friend", labelKey: "form.mentee_form.referral_source.friend" },
    {
        value: "socialMedia",
        labelKey: "form.referral_source_options.social_media",
    },
    { value: "google", labelKey: "form.referral_source_options.google" },
];

const preferenceOptions = [
    {
        value: "scheduled",
        labelKey: "form.mentee_form.preference.scheduled",
    },
    {
        value: "asynchronous",
        labelKey: "form.mentee_form.preference.asynchronous",
    },
] as const;

const getTextError = (error: unknown, touched: unknown) => {
    return touched && typeof error === "string" ? error : undefined;
};

const MenteeForm = ({ onSubmit, setStep, step, isLoading }: Props) => {
    const { t } = useTranslation();
    const { user, isFetchingUser: isLoadingUserSession } = useUser();
    const isFormDataLoading = (isLoadingUserSession && !user) || isLoading;

    const initialValues: MenteeFormValues = {
        age: "",
        name: user?.full_name || "",
        contacts: ["email"],
        email: user?.email || "",
        phone: "",
        description: "",
        contact_preference: "",
        source: "",
        tos: false,
    };

    const validationSchemas = [
        Yup.object({
            name: Yup.string()
                .min(2, t("validation.name.tooShort"))
                .required(t("validation.required")),
            age: Yup.number()
                .min(18, t("crisis.under_18_title"))
                .required(t("validation.required")),
        }),
        Yup.object({
            contacts: Yup.array().min(1, t("validation.contacts.min")),
            email: validation.email,
        }),
        Yup.object({
            description: Yup.string()
                .min(10, t("validation.description.tooShort"))
                .required(t("validation.required")),
        }),
        Yup.object({
            contact_preference: Yup.string()
                .oneOf(["scheduled", "asynchronous"])
                .required(t("validation.required")),
        }),
        Yup.object({
            source: Yup.string().required(t("validation.required")),
            tos: Yup.boolean().oneOf([true], t("validation.consent.required")),
        }),
    ];

    const lastStep = validationSchemas.length - 1;
    const progress = Math.round(((step + 1) / validationSchemas.length) * 100);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: validationSchemas[step],
        onSubmit: (values) => {
            if (step === lastStep) {
                onSubmit(values);
                return;
            }

            setStep((prev) => prev + 1);
        },
    });

    const handleAgeInputChange = (text: string) => {
        void formik.setFieldValue("age", text.replace(/[^0-9]/g, ""));
    };

    const handleContactToggle = (contact: string) => {
        const nextContacts = formik.values.contacts.includes(contact)
            ? formik.values.contacts.filter((item) => item !== contact)
            : [...formik.values.contacts, contact];

        void formik.setFieldValue("contacts", nextContacts);
    };

    const handleBack = () => {
        setStep((prev) => Math.max(0, prev - 1));
    };

    const fieldClassName =
        "rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-950";

    const renderError = (error?: string) => {
        if (!error) {
            return null;
        }

        return <Text className="mt-1 text-sm text-error">{error}</Text>;
    };

    const renderFooter = () => (
        <View className="mt-6 flex-row gap-3">
            {step > 0 ? (
                <Pressable
                    disabled={isFormDataLoading}
                    onPress={handleBack}
                    className="flex-1 items-center rounded-lg border border-primary bg-white py-3"
                >
                    <Text className="font-semibold text-primary">
                        {t("form.mentee_form.back")}
                    </Text>
                </Pressable>
            ) : null}

            <Pressable
                disabled={isFormDataLoading}
                onPress={() => formik.handleSubmit()}
                className="flex-1 items-center rounded-lg bg-primary py-3"
            >
                <Text className="font-semibold text-white">
                    {isFormDataLoading
                        ? t("form.mentee_form.sending")
                        : step === lastStep
                          ? t("form.submit")
                          : t("form.next")}
                </Text>
            </Pressable>
        </View>
    );

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="gap-5 pb-10"
            keyboardShouldPersistTaps="handled"
        >
            <View className="overflow-hidden rounded-lg bg-slate-200">
                <View
                    className="h-2 rounded-lg bg-primary"
                    style={{ width: `${progress}%` }}
                />
            </View>

            <View>
                <Text className="text-sm font-semibold text-primary">
                    {t("form.mentee_form.step_indicator", {
                        current: step + 1,
                        total: validationSchemas.length,
                    })}
                </Text>
                <Text className="mt-2 text-2xl font-bold text-slate-950">
                    {t("form.mentee_form.title")}
                </Text>
            </View>

            {step === 0 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.mentee_form.name_label")}
                        </Text>
                        <TextInput
                            value={formik.values.name}
                            onBlur={() => formik.setFieldTouched("name")}
                            onChangeText={formik.handleChange("name")}
                            className={fieldClassName}
                        />
                        {renderError(
                            getTextError(
                                formik.errors.name,
                                formik.touched.name,
                            ),
                        )}
                    </View>

                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.mentee_form.age_label")}
                        </Text>
                        <TextInput
                            value={formik.values.age}
                            keyboardType="number-pad"
                            onBlur={() => formik.setFieldTouched("age")}
                            onChangeText={handleAgeInputChange}
                            className={fieldClassName}
                        />
                        {renderError(
                            getTextError(formik.errors.age, formik.touched.age),
                        )}
                    </View>
                </View>
            ) : null}

            {step === 1 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.mentee.contact_label")}
                        </Text>
                        <View className="flex-row gap-2">
                            {contactOptions.map((option) => {
                                const isSelected =
                                    formik.values.contacts.includes(
                                        option.value,
                                    );

                                return (
                                    <Pressable
                                        key={option.value}
                                        onPress={() =>
                                            handleContactToggle(option.value)
                                        }
                                        className={`flex-1 items-center rounded-lg border px-3 py-3 ${
                                            isSelected
                                                ? "border-primary bg-primary"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected
                                                    ? "text-white"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            {t(option.labelKey)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        {renderError(
                            getTextError(
                                formik.errors.contacts,
                                formik.touched.contacts,
                            ),
                        )}
                    </View>

                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.mentee_form.contact.email")}
                        </Text>
                        <TextInput
                            value={formik.values.email}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onBlur={() => formik.setFieldTouched("email")}
                            onChangeText={formik.handleChange("email")}
                            className={fieldClassName}
                        />
                        {renderError(
                            getTextError(
                                formik.errors.email,
                                formik.touched.email,
                            ),
                        )}
                    </View>

                    {formik.values.contacts.includes("phone") ? (
                        <View>
                            <Text className="mb-2 font-semibold text-slate-800">
                                {t("form.mentee_form.contact.phone")}
                            </Text>
                            <TextInput
                                value={formik.values.phone}
                                keyboardType="phone-pad"
                                onChangeText={formik.handleChange("phone")}
                                className={fieldClassName}
                            />
                        </View>
                    ) : null}
                </View>
            ) : null}

            {step === 2 ? (
                <View>
                    <Text className="mb-2 font-semibold text-slate-800">
                        {t("form.mentee_form.description_label")}
                    </Text>
                    <TextInput
                        value={formik.values.description}
                        multiline
                        textAlignVertical="top"
                        onBlur={() => formik.setFieldTouched("description")}
                        onChangeText={formik.handleChange("description")}
                        className={`${fieldClassName} min-h-36`}
                    />
                    {renderError(
                        getTextError(
                            formik.errors.description,
                            formik.touched.description,
                        ),
                    )}
                </View>
            ) : null}

            {step === 3 ? (
                <View>
                    <Text className="mb-2 font-semibold text-slate-800">
                        {t("form.mentee_form.preference_label")}
                    </Text>
                    <View className="gap-2">
                        {preferenceOptions.map((option) => {
                            const isSelected =
                                formik.values.contact_preference ===
                                option.value;

                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() =>
                                        formik.setFieldValue(
                                            "contact_preference",
                                            option.value,
                                        )
                                    }
                                    className={`rounded-lg border px-4 py-3 ${
                                        isSelected
                                            ? "border-primary bg-primary"
                                            : "border-slate-200 bg-white"
                                    }`}
                                >
                                    <Text
                                        className={`font-semibold ${
                                            isSelected
                                                ? "text-white"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        {t(option.labelKey)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    {renderError(
                        getTextError(
                            formik.errors.contact_preference,
                            formik.touched.contact_preference,
                        ),
                    )}
                </View>
            ) : null}

            {step === 4 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.mentee_form.referral_source_label")}
                        </Text>
                        <View className="gap-2">
                            {referralSourceOptions.map((option) => {
                                const isSelected =
                                    formik.values.source === option.value;

                                return (
                                    <Pressable
                                        key={option.value}
                                        onPress={() =>
                                            formik.setFieldValue(
                                                "source",
                                                option.value,
                                            )
                                        }
                                        className={`rounded-lg border px-4 py-3 ${
                                            isSelected
                                                ? "border-primary bg-primary"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected
                                                    ? "text-white"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            {t(option.labelKey)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        {renderError(
                            getTextError(
                                formik.errors.source,
                                formik.touched.source,
                            ),
                        )}
                    </View>

                    <View className="flex-row items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
                        <Text className="flex-1 text-sm leading-5 text-slate-700">
                            {t("form.mentee_form.consent_label")}
                        </Text>
                        <Switch
                            value={formik.values.tos}
                            onValueChange={(value) =>
                                void formik.setFieldValue("tos", value)
                            }
                            trackColor={{ false: "#CBD5E1", true: "#06B7A7" }}
                        />
                    </View>
                    {renderError(
                        getTextError(formik.errors.tos, formik.touched.tos),
                    )}
                </View>
            ) : null}

            {renderFooter()}
        </ScrollView>
    );
};

export default MenteeForm;
