import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "./pl.json";

const resources = {
    pl: {
        translation: pl,
    },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    resources,
    keySeparator: ".",
    lng: "pl",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
