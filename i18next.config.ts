import { defineConfig } from "i18next-cli";

export default defineConfig({
    // TODO: add more languages in the future
    locales: ["pl"],
    extract: {
        input: "{app,modules,screens}/**/*.{ts,tsx,js,jsx}",
        output: "./locales/i18n/{{language}}.json",
        defaultNS: false,
        removeUnusedKeys: false,
        defaultValue(key) {
            return `__NOT_TRANSLATED__ (key: ${key})`;
        },
    },
});
