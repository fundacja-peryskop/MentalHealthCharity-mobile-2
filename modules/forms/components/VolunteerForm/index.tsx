import {
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { VolunteerFormValues } from "@/modules/forms/types";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

interface Props {
    onSubmit: (values: VolunteerFormValues) => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    isLoading?: boolean;
}

const educationOptions = [
    {
        value: "elementary",
        labelKey: "form.volunteer_form.education_options.elementary",
    },
    {
        value: "high_school",
        labelKey: "form.volunteer_form.education_options.high_school",
    },
    {
        value: "bachelor",
        labelKey: "form.volunteer_form.education_options.bachelor",
    },
    {
        value: "master",
        labelKey: "form.volunteer_form.education_options.master",
    },
    { value: "phd", labelKey: "form.volunteer_form.education_options.phd" },
];

const contactOptions = [
    { value: "email", labelKey: "form.volunteer_form.contact.email" },
    { value: "phone", labelKey: "form.volunteer_form.contact.phone" },
];

const experienceOptions = [
    {
        value: "yes_professional",
        labelKey: "form.volunteer_form.experience_options.yes_professional",
    },
    {
        value: "yes_personal",
        labelKey: "form.volunteer_form.experience_options.yes_personal",
    },
    { value: "no", labelKey: "form.volunteer_form.experience_options.no" },
];

const referralSourceOptions = [
    { value: "friend", labelKey: "form.referral_source_options.friend" },
    {
        value: "socialMedia",
        labelKey: "form.referral_source_options.social_media",
    },
    { value: "google", labelKey: "form.referral_source_options.google" },
];

const themeOptions = [
    { value: "no", labelKey: "form.volunteer_form.themes_options.no" },
    {
        value: "depression",
        labelKey: "form.volunteer_form.themes_options.depression",
    },
    {
        value: "alcoholism",
        labelKey: "form.volunteer_form.themes_options.alcoholism",
    },
    {
        value: "drug_addiction",
        labelKey: "form.volunteer_form.themes_options.drug_addiction",
    },
    {
        value: "self_harm",
        labelKey: "form.volunteer_form.themes_options.self_harm",
    },
    {
        value: "suicidal_thoughts",
        labelKey: "form.volunteer_form.themes_options.suicidal_thoughts",
    },
    {
        value: "eating_disorders",
        labelKey: "form.volunteer_form.themes_options.eating_disorders",
    },
    {
        value: "domestic_violence",
        labelKey: "form.volunteer_form.themes_options.domestic_violence",
    },
    {
        value: "homelessness",
        labelKey: "form.volunteer_form.themes_options.homelessness",
    },
    {
        value: "sexual_assault",
        labelKey: "form.volunteer_form.themes_options.sexual_assault",
    },
    {
        value: "grief_loss",
        labelKey: "form.volunteer_form.themes_options.grief_loss",
    },
    { value: "trauma", labelKey: "form.volunteer_form.themes_options.trauma" },
    {
        value: "anxiety",
        labelKey: "form.volunteer_form.themes_options.anxiety",
    },
    {
        value: "burnout",
        labelKey: "form.volunteer_form.themes_options.burnout",
    },
    {
        value: "loneliness",
        labelKey: "form.volunteer_form.themes_options.loneliness",
    },
];

const getTextError = (error: unknown, touched: unknown) => {
    return touched && typeof error === "string" ? error : undefined;
};

const VolunteerForm = ({ onSubmit, setStep, step, isLoading }: Props) => {
    const { t } = useTranslation();

    const initialValues: VolunteerFormValues = {
        age: "",
        contacts: [],
        description: "",
        did_help: "",
        education: "",
        phone: "",
        source: "",
        themes: [],
        tos: false,
        interview_meeting_dates: [],
    };

    const [dateInput, setDateInput] = useState("");
    const [dateError, setDateError] = useState<string | undefined>(undefined);

    const validationSchemas = [
        Yup.object({
            age: Yup.number()
                .min(18, t("validation.age.min"))
                .required(t("validation.required")),
        }),
        Yup.object({
            education: Yup.string().required(t("validation.required")),
        }),
        Yup.object({
            contacts: Yup.array().min(1, t("validation.contacts.min")),
            phone: Yup.string()
                .matches(/^[0-9]+$/, t("validation.phone"))
                .required(t("validation.required")),
        }),
        Yup.object({
            description: Yup.string()
                .min(10, t("validation.description.tooShort"))
                .required(t("validation.required")),
        }),
        Yup.object({
            interview_meeting_dates: Yup.array().min(
                1,
                t("validation.required"),
            ),
        }),
        Yup.object({
            source: Yup.string().required(t("validation.required")),
            did_help: Yup.string().required(t("validation.required")),
        }),
        Yup.object({
            themes: Yup.array(),
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

    const handleThemeToggle = (value: string) => {
        const current = formik.values.themes;
        let next: string[];

        if (value === "no") {
            next = current.includes("no") ? [] : ["no"];
        } else if (current.includes(value)) {
            next = current.filter((item) => item !== value);
        } else {
            next = [...current.filter((item) => item !== "no"), value];
        }

        void formik.setFieldValue("themes", next);
    };

    const handleAddDate = () => {
        const trimmed = dateInput.trim();

        if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            setDateError(t("form.volunteer_form.invalid_date"));
            return;
        }

        if (formik.values.interview_meeting_dates.includes(trimmed)) {
            setDateError(t("form.volunteer_form.duplicate_date"));
            return;
        }

        setDateError(undefined);
        void formik.setFieldValue("interview_meeting_dates", [
            ...formik.values.interview_meeting_dates,
            trimmed,
        ]);
        setDateInput("");
    };

    const handleRemoveDate = (date: string) => {
        void formik.setFieldValue(
            "interview_meeting_dates",
            formik.values.interview_meeting_dates.filter(
                (item) => item !== date,
            ),
        );
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

    const renderOptionList = (
        options: { value: string; labelKey: string }[],
        selectedValue: string,
        onSelect: (value: string) => void,
    ) => (
        <View className="gap-2">
            {options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => onSelect(option.value)}
                        className={`rounded-lg border px-4 py-3 ${
                            isSelected
                                ? "border-primary bg-primary"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                isSelected ? "text-white" : "text-slate-700"
                            }`}
                        >
                            {t(option.labelKey)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    const renderThemeChips = () => (
        <View className="flex-row flex-wrap gap-2">
            {themeOptions.map((option) => {
                const isSelected = formik.values.themes.includes(option.value);

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => handleThemeToggle(option.value)}
                        className={`rounded-full border px-4 py-2 ${
                            isSelected
                                ? "border-primary bg-primary"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <Text
                            className={`text-sm font-semibold ${
                                isSelected ? "text-white" : "text-slate-700"
                            }`}
                        >
                            {t(option.labelKey)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    const renderFooter = () => (
        <View className="mt-6 flex-row gap-3">
            {step > 0 ? (
                <Pressable
                    disabled={isLoading}
                    onPress={handleBack}
                    className="flex-1 items-center rounded-lg border border-primary bg-white py-3"
                >
                    <Text className="font-semibold text-primary">
                        {t("form.volunteer_form.back")}
                    </Text>
                </Pressable>
            ) : null}

            <Pressable
                disabled={isLoading}
                onPress={() => formik.handleSubmit()}
                className="flex-1 items-center rounded-lg bg-primary py-3"
            >
                <Text className="font-semibold text-white">
                    {isLoading
                        ? t("form.volunteer_form.sending")
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
                    {t("form.volunteer_form.step_indicator", {
                        current: step + 1,
                        total: validationSchemas.length,
                    })}
                </Text>
                <Text className="mt-2 text-2xl font-bold text-slate-950">
                    {t("form.volunteer_form.title")}
                </Text>
            </View>

            {step === 0 ? (
                <View>
                    <Text className="mb-2 font-semibold text-slate-800">
                        {t("form.volunteer_form.age_label")}
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
            ) : null}

            {step === 1 ? (
                <View>
                    <Text className="mb-2 font-semibold text-slate-800">
                        {t("form.volunteer_form.education_label")}
                    </Text>
                    {renderOptionList(
                        educationOptions,
                        formik.values.education,
                        (value) => formik.setFieldValue("education", value),
                    )}
                    {renderError(
                        getTextError(
                            formik.errors.education,
                            formik.touched.education,
                        ),
                    )}
                </View>
            ) : null}

            {step === 2 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.volunteer_form.contact_label")}
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
                            {t("form.volunteer_form.phone_label")}
                        </Text>
                        <TextInput
                            value={formik.values.phone}
                            keyboardType="phone-pad"
                            onBlur={() => formik.setFieldTouched("phone")}
                            onChangeText={formik.handleChange("phone")}
                            className={fieldClassName}
                        />
                        {renderError(
                            getTextError(
                                formik.errors.phone,
                                formik.touched.phone,
                            ),
                        )}
                    </View>
                </View>
            ) : null}

            {step === 3 ? (
                <View>
                    <Text className="mb-2 font-semibold text-slate-800">
                        {t("form.volunteer_form.description_label")}
                    </Text>
                    <TextInput
                        value={formik.values.description}
                        multiline
                        textAlignVertical="top"
                        placeholder={t(
                            "form.volunteer_form.description_placeholder",
                        )}
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

            {step === 4 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t(
                                "form.volunteer_form.interview_meeting_dates_label",
                            )}
                        </Text>
                        <View className="flex-row gap-2">
                            <TextInput
                                value={dateInput}
                                placeholder={t(
                                    "form.volunteer_form.interview_meeting_dates_placeholder",
                                )}
                                onChangeText={setDateInput}
                                className={`${fieldClassName} flex-1`}
                            />
                            <Pressable
                                onPress={handleAddDate}
                                className="items-center justify-center rounded-lg bg-primary px-4"
                            >
                                <Text className="font-semibold text-white">
                                    {t("form.volunteer_form.add_date")}
                                </Text>
                            </Pressable>
                        </View>
                        {dateError ? (
                            <Text className="mt-1 text-sm text-error">
                                {dateError}
                            </Text>
                        ) : null}
                        {formik.values.interview_meeting_dates.map((date) => (
                            <View
                                key={date}
                                className="mt-2 flex-row items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                            >
                                <Text className="text-slate-800">{date}</Text>
                                <Pressable
                                    onPress={() => handleRemoveDate(date)}
                                >
                                    <Text className="font-semibold text-error">
                                        {t("form.volunteer_form.remove_date")}
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                        {renderError(
                            getTextError(
                                formik.errors.interview_meeting_dates,
                                formik.touched.interview_meeting_dates,
                            ),
                        )}
                    </View>
                </View>
            ) : null}

            {step === 5 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.volunteer_form.experience_label")}
                        </Text>
                        {renderOptionList(
                            experienceOptions,
                            formik.values.did_help,
                            (value) => formik.setFieldValue("did_help", value),
                        )}
                        {renderError(
                            getTextError(
                                formik.errors.did_help,
                                formik.touched.did_help,
                            ),
                        )}
                    </View>

                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.volunteer_form.referral_source_label")}
                        </Text>
                        {renderOptionList(
                            referralSourceOptions,
                            formik.values.source,
                            (value) => formik.setFieldValue("source", value),
                        )}
                        {renderError(
                            getTextError(
                                formik.errors.source,
                                formik.touched.source,
                            ),
                        )}
                    </View>
                </View>
            ) : null}

            {step === 6 ? (
                <View className="gap-4">
                    <View>
                        <Text className="mb-2 font-semibold text-slate-800">
                            {t("form.volunteer_form.themes_label")}
                        </Text>
                        {renderThemeChips()}
                    </View>

                    <View className="flex-row items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
                        <Text className="flex-1 text-sm leading-5 text-slate-700">
                            {t("form.volunteer_form.consent_label")}
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

export default VolunteerForm;
