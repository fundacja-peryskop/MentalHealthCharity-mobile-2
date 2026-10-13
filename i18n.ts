import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "./locales/i18n/pl.json";
import { Languages } from "./modules/shared/constants";

const primaryLang = Localization.getLocales()[0]?.languageCode;

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng:
        primaryLang && primaryLang.startsWith(Languages.PL)
            ? Languages.PL
            : // TODO: add more languages in the future
              Languages.PL,
    fallbackLng: Languages.PL,
    resources: {
        pl: { translation: pl },
    },
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
});

export default i18n;
